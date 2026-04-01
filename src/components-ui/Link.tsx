'use client';
import { Link as RACLink, type LinkProps } from 'react-aria-components';
import './Link.sass';

export function Link(props: LinkProps) {
  return <RACLink {...props} />;
}
