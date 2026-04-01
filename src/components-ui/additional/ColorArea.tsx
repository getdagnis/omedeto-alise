'use client';
import { ColorArea as AriaColorArea, type ColorAreaProps } from 'react-aria-components';

import { ColorThumb } from './ColorThumb';
import './ColorArea.sass';

export function ColorArea(props: ColorAreaProps) {
  return (
    <AriaColorArea {...props}>
      <ColorThumb />
    </AriaColorArea>
  );
}
