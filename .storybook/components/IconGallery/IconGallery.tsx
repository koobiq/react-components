import { Fragment, useState } from 'react';

import { Typography, Input } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';
import * as icons from '@koobiq/react-icons';
import { IconMagnifyingGlass16 } from '@koobiq/react-icons';

import iconsManifest from '../../../packages/icons/manifest.json';
import { slugify } from '../../utils';

import s from './IconGallery.module.css';

export type IconsManifest = {
  icons: {
    componentName: string;
    size: string;
  }[];
};

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

  const filteredIcons = iconsManifest.icons.filter(({ componentName }) =>
    componentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={clsx(s.search, 'sb-unstyled')}>
        <Input
          label="Search an icon by name"
          placeholder="Search…"
          value={search}
          onChange={handleSearch}
          startAddon={<IconMagnifyingGlass16 />}
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
              {items.map(({ componentName: name }) => {
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
