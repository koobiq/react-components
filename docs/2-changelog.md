import { Markdown, Meta } from '../.storybook/components';

<Meta title="Changelog" />

import Changelog from '../CHANGELOG.md?raw';

<Markdown className="changelog-page">{Changelog}</Markdown>
