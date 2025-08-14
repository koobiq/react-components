import { type CSSProperties, useState } from 'react';

import { useHideOverflowItems } from './index';

export default {
  title: 'Hooks/useHideOverflowItems',
  tags: ['status:new'],
};

const parentStyle = {
  blockSize: 24,
  display: 'flex',
  inlineSize: '100%',
  overflow: 'hidden',
  resize: 'horizontal',
  maxInlineSize: '100%',
} as CSSProperties;

const itemStyle = {
  blockSize: 24,
  paddingInline: 8,
  marginInlineEnd: 8,
  whiteSpace: 'nowrap',
  alignItems: 'center',
  display: 'inline-flex',
  boxSizing: 'border-box',
  backgroundColor: 'var(--kbq-background-contrast-fade)',
  fontFamily: 'var(--kbq-font-family-mono)',
} as CSSProperties;

const moreStyle = {
  color: 'var(--kbq-white-default)',
  fontFamily: 'var(--kbq-font-family-mono)',
  backgroundColor: 'var(--kbq-background-theme)',
} as CSSProperties;

const hiddenStyle = {
  visibility: 'hidden',
  position: 'absolute',
  left: '-300vw',
} as CSSProperties;

export const End = () => {
  const length = 10;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
  });

  return (
    <div ref={parentRef} style={parentStyle}>
      {new Array(length).fill(0).map((_, i) => (
        <div
          key={i}
          ref={itemsRefs[i]}
          style={{
            ...itemStyle,
            ...(!visibleMap[i] && hiddenStyle),
          }}
        >
          item {i + 1}
        </div>
      ))}
      <div
        ref={itemsRefs[itemsRefs.length - 1]}
        style={{
          ...itemStyle,
          ...moreStyle,
          ...(!visibleMap[length] && hiddenStyle),
        }}
      >
        more
      </div>
    </div>
  );
};

End.storyName = 'End';

export const Start = () => {
  const length = 10;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    moreIndex: 0,
  });

  return (
    <div ref={parentRef} style={parentStyle}>
      <div
        ref={itemsRefs[0]}
        style={{
          ...itemStyle,
          ...moreStyle,
          ...(!visibleMap[0] && hiddenStyle),
        }}
      >
        more
      </div>
      {new Array(length).fill(0).map((_, i) => (
        <div
          key={i}
          ref={itemsRefs[i + 1]}
          style={{
            ...itemStyle,
            ...(!visibleMap[i + 1] && hiddenStyle),
          }}
        >
          item {i + 1}
        </div>
      ))}
    </div>
  );
};

Start.storyName = 'Start';

export const Center = () => {
  const length = 10;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    moreIndex: 5,
  });

  return (
    <div ref={parentRef} style={parentStyle}>
      {new Array(5).fill(0).map((_, i) => (
        <div
          key={i}
          ref={itemsRefs[i]}
          style={{
            ...itemStyle,
            ...(!visibleMap[i] && hiddenStyle),
          }}
        >
          item {i + 1}
        </div>
      ))}
      <div
        ref={itemsRefs[5]}
        style={{
          ...itemStyle,
          ...moreStyle,
          ...(!visibleMap[5] && hiddenStyle),
        }}
      >
        more
      </div>
      {new Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          ref={itemsRefs[i + 6]}
          style={{
            ...itemStyle,
            ...(!visibleMap[i + 6] && hiddenStyle),
          }}
        >
          item {i + 6}
        </div>
      ))}
    </div>
  );
};

Center.storyName = 'Center';

export const Pinned = () => {
  const length = 10;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    pinnedIndex: 0,
  });

  return (
    <div ref={parentRef} style={parentStyle}>
      {new Array(length).fill(0).map((_, i) => (
        <div
          key={i}
          ref={itemsRefs[i]}
          style={{
            ...itemStyle,
            ...(!visibleMap[i] && hiddenStyle),
          }}
        >
          item {i + 1}
        </div>
      ))}
      <div
        ref={itemsRefs[itemsRefs.length - 1]}
        style={{
          ...itemStyle,
          ...moreStyle,
          ...(!visibleMap[length] && hiddenStyle),
        }}
      >
        more
      </div>
    </div>
  );
};

Pinned.storyName = 'Pinned';

export const Playground = () => {
  const [count, setCount] = useState(0);

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: count + 1,
    deps: [count],
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Add an item</button>
      <br />
      <br />
      <div ref={parentRef} style={parentStyle}>
        {new Array(count).fill(0).map((_, i) => (
          <div
            key={i}
            ref={itemsRefs[i]}
            style={{
              ...itemStyle,
              ...(!visibleMap[i] && hiddenStyle),
            }}
          >
            item {i}
          </div>
        ))}
        <div
          ref={itemsRefs[itemsRefs.length - 1]}
          style={{
            ...itemStyle,
            ...moreStyle,
            ...(!visibleMap[count] && hiddenStyle),
          }}
        >
          more
        </div>
      </div>
    </div>
  );
};

Playground.storyName = 'Playground';
