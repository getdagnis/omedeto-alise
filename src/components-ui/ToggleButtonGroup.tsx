'use client';
import { ToggleButtonGroup as RACToggleButtonGroup, type ToggleButtonGroupProps } from 'react-aria-components';
import './ToggleButtonGroup.sass';

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return <RACToggleButtonGroup {...props} />;
}
