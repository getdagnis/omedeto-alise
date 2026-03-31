import {
  ToggleButtonGroup as RACToggleButtonGroup,
  SelectionIndicator,
  ToggleButton,
  composeRenderProps,
} from 'react-aria-components';
import type { ToggleButtonProps, ToggleButtonGroupProps } from 'react-aria-components';
import styles from './SegmentedControl.module.sass';

export function SegmentedControl(props: ToggleButtonGroupProps) {
  return <RACToggleButtonGroup {...props} className={`segmented-control button-base`} data-variant="secondary" />;
}

export function SegmentedControlItem(props: ToggleButtonProps) {
  return (
    <ToggleButton {...props} className={`segmented-control-item`}>
      {composeRenderProps(props.children, (children) => (
        <>
          <SelectionIndicator className={`${styles['react-aria-SelectionIndicator']} button-base`} data-selected />
          <span>{children}</span>
        </>
      ))}
    </ToggleButton>
  );
}
