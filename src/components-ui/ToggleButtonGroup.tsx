import { ToggleButtonGroup as RACToggleButtonGroup } from 'react-aria-components';
import type { ToggleButtonGroupProps } from 'react-aria-components';
import styles from './ToggleButtonGroup.module.sass';

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return <RACToggleButtonGroup {...props} />;
}
