import { ToggleButton as RACToggleButton } from 'react-aria-components';
import { composeRenderProps, type ToggleButtonProps as RACToggleButtonProps } from 'react-aria-components';
import styles from './ToggleButton.module.sass';

interface ToggleButtonProps extends RACToggleButtonProps {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
}

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <RACToggleButton
      {...props}
      className={`${styles['react-aria-ToggleButton']} button-base`}
      data-variant={props.variant || 'primary'}
    >
      {composeRenderProps(props.children, (children) => (
        <span>{children}</span>
      ))}
    </RACToggleButton>
  );
}
