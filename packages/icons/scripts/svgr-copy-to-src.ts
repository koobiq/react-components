import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs-extra';

import { config } from '../config.js';

const getIconSizeFromFilePath = (filePath: string) => {
  const arrFilePath = filePath.split('/');
  const rootPathIdx = arrFilePath.indexOf(config.figmaFile.page);

  return arrFilePath[rootPathIdx + 1];
};

// TODO: export the type from the library
type ManifestJSON = {
  icons: {
    componentName: string;
    size?: string;
  }[];
};

const fileName = fileURLToPath(import.meta.url);

const dirName = dirname(fileName);

const getFiles = async (
  dirPath: string,
  arrayOfFiles: { path: string; fileName: string }[] = []
) => {
  const entries = await fs.readdir(dirPath);

  for await (const entry of entries) {
    if (entry !== 'index.ts') {
      const fullPath = join(dirPath, entry);
      const entryStat = await fs.stat(fullPath);

      if (entryStat.isDirectory()) {
        await getFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push({ path: fullPath, fileName: entry });
      }
    }
  }

  return arrayOfFiles;
};

const copyIcons = async (destPath: string, svgrDir: string) => {
  const iconsList = await getFiles(svgrDir);

  const manifest: ManifestJSON = {
    icons: [],
  };

  const entryPoints: string[] = [];

  for await (const item of iconsList) {
    const destFilePath = join(destPath, item.fileName);
    await fs.copy(item.path, destFilePath);

    const size = getIconSizeFromFilePath(item.path);

    manifest.icons.push({
      componentName: item.fileName.replace('.tsx', ''),
      ...(size && { size }),
    });

    entryPoints.push(
      `export * from './${item.fileName.replace('.tsx', '.js')}';`
    );
  }

  return { manifest, entryPoints };
};

const main = async () => {
  const destDir = join(dirName, '../src/');

  const svgrDir = join(
    dirName,
    `../${config.output.tempSvg}/${config.figmaFile.page}`
  );

  try {
    // Remove and create the destination directory
    await fs.remove(destDir);
    await fs.ensureDir(destDir);

    // Copy icons and info file
    const { manifest, entryPoints } = await copyIcons(destDir, svgrDir);

    // Create an entry point file
    await fs.outputFile(`${destDir}/index.ts`, entryPoints.join('\n'));

    // Create a manifest.json file
    await fs.outputJSON(`${dirName}/../manifest.json`, manifest, { spaces: 3 });

    console.log('Files successfully created.');
  } catch (error) {
    console.error('Error executing the script:', error);
    process.exit(1);
  }
};

(async () => {
  await main();
})();
