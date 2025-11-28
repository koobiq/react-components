import { Fragment, useState } from 'react';

import { Typography, SearchInput } from '@koobiq/react-components';
import { clsx, useDebounceCallback } from '@koobiq/react-core';
import type { IconsManifest } from '@koobiq/react-icons';

import iconsManifest from '../../../packages/icons/manifest.json';
import { slugify } from '../../utils';

import { IconDetails } from './IconDetails';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [handleChangeDebounced] = useDebounceCallback({
    callback: setDebouncedSearch,
  });

  const filteredIcons = manifest.filter(({ name, keywords }) => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return true;

    const inName = name.toLowerCase().includes(query);

    const inKeywords = keywords?.some((keyword) =>
      keyword.toLowerCase().includes(query)
    );

    return inName || inKeywords;
  });

  return (
    <>
      <div className={clsx(s.search, 'sb-unstyled')}>
        <SearchInput
          label="Search"
          placeholder="Search icons by name or keyword"
          onChange={handleChangeDebounced}
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
              {items.map((item) => (
                <IconDetails key={item.name} {...item} />
              ))}
            </div>
          </Fragment>
        ))
      )}
    </>
  );
};
