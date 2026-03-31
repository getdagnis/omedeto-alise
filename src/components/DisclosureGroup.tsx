import { DisclosureGroup as RACDisclosureGroup } from 'react-aria-components';
import type { DisclosureGroupProps } from 'react-aria-components';
import styles from './DisclosureGroup.module.sass';

export function DisclosureGroup(props: DisclosureGroupProps) {
  return <RACDisclosureGroup {...props} />;
}
