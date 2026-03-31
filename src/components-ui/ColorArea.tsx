import { ColorArea as AriaColorArea } from 'react-aria-components';
import type { ColorAreaProps } from 'react-aria-components';

import {ColorThumb} from './ColorThumb';
import styles from './ColorArea.module.sass';

export function ColorArea(props: ColorAreaProps) {
  return (
    (
      <AriaColorArea {...props}>
        <ColorThumb />
      </AriaColorArea>
    )
  );
}
