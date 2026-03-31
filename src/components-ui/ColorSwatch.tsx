import { ColorSwatch as AriaColorSwatch } from 'react-aria-components';
import type { ColorSwatchProps } from 'react-aria-components';

import styles from './ColorSwatch.module.sass';

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    (
      <AriaColorSwatch
        {...props}
        style={({ color }) => ({
          background: `linear-gradient(${color}, ${color}),
          repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`
        })}
      />
    )
  );
}
