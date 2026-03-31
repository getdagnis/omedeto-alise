import { ColorWheel as AriaColorWheel, ColorWheelTrack } from 'react-aria-components';
import type { ColorWheelProps as AriaColorWheelProps } from 'react-aria-components';

import {ColorThumb} from './ColorThumb';

import styles from './ColorWheel.module.sass';
export type ColorWheelProps = Omit<AriaColorWheelProps, 'outerRadius' | 'innerRadius'>;

export function ColorWheel(props: ColorWheelProps) {
  return (
    (
      <AriaColorWheel {...props} outerRadius={100} innerRadius={74}>
        <ColorWheelTrack />
        <ColorThumb />
      </AriaColorWheel>
    )
  );
}
