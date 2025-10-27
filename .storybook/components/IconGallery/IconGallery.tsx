import { Fragment, useState } from 'react';

import { Typography, SearchInput } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';
import * as icons from '@koobiq/react-icons';
import type { IconsManifest } from '@koobiq/react-icons';

import iconsManifest from '../../../packages/icons/manifest.json';
import { slugify } from '../../utils';

import s from './IconGallery.module.css';

const manifest = iconsManifest.icons as IconsManifest['icons'];

function groupBy(icons: IconsManifest['icons'], key: 'size') {
  return icons.reduce(
    (groups, icon) => {
      const acc = { ...groups };
      acc[icon[key]] = acc[icon[key]] || [];
      acc[icon[key]]?.push(icon);

      return acc;
    },
    {} as Record<string, IconsManifest['icons']>
  );
}

export const IconGallery = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredIcons = manifest.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={clsx(s.search, 'sb-unstyled')}>
        <SearchInput
          value={search}
          label="Search an icon by name"
          placeholder="Search…"
          onChange={handleSearch}
          fullWidth
        />
      </div>
      {filteredIcons.length <= 0 ? (
        <Typography>No icons found</Typography>
      ) : (
        Object.entries<IconsManifest['icons']>(
          groupBy(filteredIcons, 'size')
        ).map(([size, items]) => (
          <Fragment key={size}>
            <h2 id={slugify(size)}>Size {size}</h2>
            <div className={clsx(s.grid, 'sb-unstyled')}>
              {items.map(({ name }) => {
                const Icon = icons[name];

                return (
                  <div key={name} className={s['grid-item']}>
                    <Icon />
                    <Typography
                      align="center"
                      variant="text-compact"
                      className={s['icon-name']}
                      ellipsis
                    >
                      {name}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </Fragment>
        ))
      )}
    </>
  );
};
