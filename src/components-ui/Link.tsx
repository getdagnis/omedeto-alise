import { Link as RACLink } from 'react-aria-components';
import type { LinkProps } from 'react-aria-components';
import styles from './Link.module.sass';

export function Link(props: LinkProps) {
  return <RACLink {...props} />;
}
