import { Button as RACButton } from 'react-aria-components';
import { composeRenderProps, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { ProgressCircle } from './ProgressCircle';
import styles from './Button.module.sass';

interface ButtonProps extends RACButtonProps {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
}

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={`${styles['react-aria-Button']} button-base`}
      data-variant={props.variant || 'primary'}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {!isPending && children}
          {isPending && <ProgressCircle aria-label="Saving..." isIndeterminate />}
        </>
      ))}
    </RACButton>
  );
}
