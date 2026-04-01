import { ColorThumb as AriaColorThumb, type ColorThumbProps } from 'react-aria-components';

import './ColorThumb.sass';

export function ColorThumb(props: ColorThumbProps) {
  return <AriaColorThumb {...props} />;
}
