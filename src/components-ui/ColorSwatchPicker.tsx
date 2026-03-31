import { ColorSwatchPicker as AriaColorSwatchPicker, ColorSwatchPickerItem as AriaColorSwatchPickerItem } from 'react-aria-components';
import type { ColorSwatchPickerItemProps, ColorSwatchPickerProps } from 'react-aria-components';

import {ColorSwatch} from './ColorSwatch';

import styles from './ColorSwatchPicker.module.sass';

export function ColorSwatchPicker(
  { children, ...props }: ColorSwatchPickerProps
) {
  return (
    (
      <AriaColorSwatchPicker {...props}>
        {children}
      </AriaColorSwatchPicker>
    )
  );
}

export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps) {
  return (
    (
      <AriaColorSwatchPickerItem {...props}>
        <ColorSwatch />
      </AriaColorSwatchPickerItem>
    )
  );
}
