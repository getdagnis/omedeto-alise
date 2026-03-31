import { ColorThumb as AriaColorThumb } from 'react-aria-components';
import type { ColorThumbProps } from 'react-aria-components';

import styles from './ColorThumb.module.sass';

export function ColorThumb(props: ColorThumbProps) {
  return <AriaColorThumb {...props} />;
}