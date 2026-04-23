import fs from 'node:fs';
import path from 'node:path';

import config from '../llms.config.mjs';

const SECTION_ORDER = [
  'Guides',
  'Templates',
  'Components',
  'Hooks',
  'Primitives',
  'Mixins',
];

const COMPONENT_SECTION_BY_PREFIX = {
  components: 'Components',
  hooks: 'Hooks',
  primitives: 'Primitives',
  mixins: 'Mixins',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureManifest(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing ${label} manifest at ${filePath}. Run "pnpm build-storybook" first.`
    );
  }
}

function createHostedUrl(relativePath) {
  const baseUrl = (config.storybookBaseUrl || '').replace(/\/+$/, '');
  const cleanPath = `${relativePath || ''}`.replace(/^\/+/, '');

  return baseUrl ? `${baseUrl}/${cleanPath}` : `./${cleanPath}`;
}

function getSectionFromComponentId(id) {
  const prefix = `${id || ''}`.split('-')[0];

  return COMPONENT_SECTION_BY_PREFIX[prefix] || 'Guides';
}

function getLabel(title, fallbackLabel) {
  if (!title) {
    return fallbackLabel || '';
  }

  if (!title.includes('/')) {
    return title;
  }

  return title.split('/').slice(1).join('/');
}

function escapeTableCell(value) {
  return `${value || '-'}`.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function renderPropsTable(props) {
  const entries = Object.values(props || {});

  if (!entries.length) {
    return 'No props available.';
  }

  const lines = [
    '| Prop | Type | Required | Default | Description |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const prop of entries) {
    const type = prop.type?.name || prop.type?.raw || '-';
    const defaultValue = prop.defaultValue?.value || '-';

    lines.push(
      `| ${escapeTableCell(prop.name)} | ${escapeTableCell(type)} | ${
        prop.required ? 'yes' : 'no'
      } | ${escapeTableCell(defaultValue)} | ${escapeTableCell(
        prop.description
      )} |`
    );
  }

  return lines.join('\n');
}

function toStoryKey(value) {
  return `${value || ''}`
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// Replace MDX Story and Props tags with plain markdown.
function injectDocsContent(content, stories, propsTable) {
  const storyMap = new Map();

  for (const story of stories || []) {
    const idKey = `${story.id || ''}`.split('--').pop();
    const nameKey = toStoryKey(story.name);

    if (idKey) {
      storyMap.set(idKey, story);
    }

    if (nameKey) {
      storyMap.set(nameKey, story);
    }
  }

  return `${content || ''}`
    .replace(
      /<Story\s+of=\{Stories\.([A-Za-z0-9_]+)}\s*\/>/g,
      (match, storyName) => {
        const story = storyMap.get(toStoryKey(storyName));

        if (!story?.snippet) {
          return match;
        }

        return ['```tsx', `${story.snippet || ''}`.trim(), '```'].join('\n');
      }
    )
    .replace(/<Props\s+of=\{Stories\.[A-Za-z0-9_]+}\s*\/>/g, propsTable)
    .trim();
}

function renderDetailFile(item) {
  const propsTable = renderPropsTable(
    item.componentEntry.reactDocgenTypescript?.props
  );

  const documentation = injectDocsContent(
    item.docEntry?.content,
    item.componentEntry.stories,
    propsTable
  );

  const parts = [];

  if (documentation) {
    parts.push(documentation);
  }

  if (item.docsUrl) {
    parts.push(['## References', '', `- docs: ${item.docsUrl}`].join('\n'));
  }

  return `${parts.join('\n\n').trim()}\n`;
}

// Build component files from components.json.
// Fall back to docs.json for entries like forms/date-formatter.
function createComponentItems(componentsEntries, docsEntries) {
  const items = Object.values(componentsEntries).map((componentEntry) => {
    const [docId, docData] = Object.entries(componentEntry.docs || {})[0] || [];
    const fallbackDocId = `${componentEntry.id}--docs`;
    const fallbackDocEntry = docsEntries[fallbackDocId];

    let docEntry = null;

    if (docId) {
      docEntry = { id: docId, ...docData };
    } else if (fallbackDocEntry) {
      docEntry = { id: fallbackDocId, ...fallbackDocEntry };
    }

    const label = getLabel(docEntry?.title, componentEntry.name);
    const resolvedDocId = docEntry?.id || `${componentEntry.id}--docs`;
    const detailFileName = `${componentEntry.id || 'entry'}.txt`;

    return {
      id: componentEntry.id,
      label,
      section: getSectionFromComponentId(componentEntry.id),
      summary: `${componentEntry.description || ''}`
        .replace(/\s+/g, ' ')
        .trim(),
      detailFileName,
      detailUrl: createHostedUrl(`llms/${detailFileName}`),
      docsUrl: createHostedUrl(`?path=/docs/${resolvedDocId}`),
      componentEntry,
      docEntry,
    };
  });

  items.sort((left, right) => left.label.localeCompare(right.label, 'en'));

  return items;
}

// Use docs.json for standalone guides and templates.
function createGuideItems(docsEntries, componentsEntries) {
  const excludedDocIds = new Set();

  for (const componentEntry of Object.values(componentsEntries)) {
    for (const docId of Object.keys(componentEntry.docs || {})) {
      excludedDocIds.add(docId);
    }

    excludedDocIds.add(`${componentEntry.id}--docs`);
  }

  const items = Object.entries(docsEntries)
    .filter(([docId]) => !excludedDocIds.has(docId))
    .map(([docId, docEntry]) => {
      const section = `${docEntry.title || ''}`.startsWith('Templates/')
        ? 'Templates'
        : 'Guides';

      return {
        label: getLabel(docEntry.title, docEntry.title),
        section,
        docsUrl: createHostedUrl(`?path=/docs/${docId}`),
        summary: '',
      };
    });

  items.sort((left, right) => left.label.localeCompare(right.label, 'en'));

  return items;
}

function renderIndexSection(sectionName, items) {
  const lines = [`## ${sectionName}`, ''];

  for (const item of items) {
    const itemPath = `${sectionName}/${item.label}`;
    const itemUrl = item.detailUrl || item.docsUrl;
    const suffix = item.summary ? `: ${item.summary}` : '';

    lines.push(`- [${itemPath}](${itemUrl})${suffix}`);
  }

  return lines.join('\n');
}

// Write llms.txt and one detail file per component entry.
function writeOutput(rootDir) {
  const distPath = path.join(rootDir, config.distPath);
  const docsManifestPath = path.join(distPath, 'manifests/docs.json');

  const componentsManifestPath = path.join(
    distPath,
    'manifests/components.json'
  );

  const llmsDir = path.join(distPath, 'llms');

  ensureManifest(docsManifestPath, 'docs');
  ensureManifest(componentsManifestPath, 'components');

  const docsEntries = readJson(docsManifestPath).docs || {};
  const componentsEntries = readJson(componentsManifestPath).components || {};
  const componentItems = createComponentItems(componentsEntries, docsEntries);
  const guideItems = createGuideItems(docsEntries, componentsEntries);
  const allItems = [...componentItems, ...guideItems];

  const indexLines = [
    '<!-- This file is auto-generated. Do not edit it manually! -->',
    '',
    `# ${config.summaryTitle}`,
    '',
    `> ${config.summaryDescription}`,
    '',
    `- docs: ${config.storybookBaseUrl || createHostedUrl('')}`,
    `- github: ${config.repositoryUrl}`,
    '',
  ];

  for (const section of SECTION_ORDER) {
    const sectionItems = allItems.filter((item) => item.section === section);

    if (sectionItems.length) {
      indexLines.push(renderIndexSection(section, sectionItems), '');
    }
  }

  fs.mkdirSync(distPath, { recursive: true });
  fs.rmSync(llmsDir, { recursive: true, force: true });
  fs.mkdirSync(llmsDir, { recursive: true });

  fs.writeFileSync(
    path.join(distPath, 'llms.txt'),
    `${indexLines.join('\n').trim()}\n`,
    'utf8'
  );

  for (const item of componentItems) {
    fs.writeFileSync(
      path.join(llmsDir, item.detailFileName),
      renderDetailFile(item),
      'utf8'
    );
  }

  const summaryLines = [
    'Generator llms.txt',
    `ℹ️ Found ${componentItems.length} component entries and ${Object.keys(docsEntries).length} docs entries.`,
    `✅ Wrote index to ${config.distPath}/llms.txt`,
    `✅ Wrote detailed files to ${config.distPath}/llms (${componentItems.length} files)`,
  ];

  console.log(summaryLines.join('\n'));
}

try {
  writeOutput(process.cwd());
} catch (error) {
  console.error(error);
  process.exit(1);
}
