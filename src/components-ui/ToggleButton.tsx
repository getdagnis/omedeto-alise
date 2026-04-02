'use client';
import {
  composeRenderProps,
  ToggleButton as RACToggleButton,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import './ToggleButton.sass';

interface ToggleButtonProps extends RACToggleButtonProps {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'pill' | 'square';
}

export function ToggleButton(props: ToggleButtonProps) {
  const { variant = 'primary', size = 'md', shape = 'default' } = props;

  return (
    <RACToggleButton
      {...props}
      className={composeRenderProps(props.className, (className) =>
        ['react-aria-ToggleButton', 'button-base', className].filter(Boolean).join(' '),
      )}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
    >
      {composeRenderProps(props.children, (children) => (
        <span>{children}</span>
      ))}
    </RACToggleButton>
  );
}
