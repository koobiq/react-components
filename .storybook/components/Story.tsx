import { Canvas } from '@storybook/addon-docs';

enum SourceType {
  /**
   * AUTO is the default
   *
   * Use the CODE logic if:
   *
   * - The user has set a custom source snippet in `docs.source.code` story parameter
   * - The story is not an args-based story
   *
   * Use the DYNAMIC rendered snippet if the story is an args story
   */
  AUTO = 'auto',
  /** Render the code extracted by source-loader */
  CODE = 'code',
  /** Render dynamically-rendered source snippet from the story's virtual DOM (currently React only) */
  DYNAMIC = 'dynamic',
}

export function Story({ withToolbar = true, ...props }) {
  return (
    <Canvas
      withToolbar={withToolbar}
      source={{
        type: SourceType.CODE,
      }}
      {...props}
    />
  );
}
