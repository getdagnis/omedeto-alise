'use client';
import {
  Button,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components';
import { ColorArea } from './additional/ColorArea';
import { ColorField } from './additional/ColorField';
import { ColorSlider } from './additional/ColorSlider';
import { ColorSwatch } from './ColorSwatch';
import { DialogTrigger } from './additional/Dialog';
import { Popover } from './Popover';

import './ColorPicker.sass';

export interface ColorPickerProps extends Omit<AriaColorPickerProps, 'children'> {
  label?: string;
  children?: React.ReactNode;
}

export function ColorPicker({ label, children, ...props }: ColorPickerProps) {
  return (
    <AriaColorPicker {...props}>
      <DialogTrigger>
        <Button className="color-picker">
          <ColorSwatch />
          <span>{label}</span>
        </Button>
        <Popover hideArrow placement="bottom start" className="color-picker-dialog">
          {children || (
            <>
              <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
              <ColorSlider colorSpace="hsb" channel="hue" />
              <ColorField label="Hex" />
            </>
          )}
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  );
}
