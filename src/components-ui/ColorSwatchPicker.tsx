'use client';
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerItemProps,
  type ColorSwatchPickerProps,
} from 'react-aria-components';

import { ColorSwatch } from './ColorSwatch';

import './ColorSwatchPicker.sass';

export function ColorSwatchPicker({ children, ...props }: ColorSwatchPickerProps) {
  return <AriaColorSwatchPicker {...props}>{children}</AriaColorSwatchPicker>;
}

export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem {...props}>
      <ColorSwatch />
    </AriaColorSwatchPickerItem>
  );
}
