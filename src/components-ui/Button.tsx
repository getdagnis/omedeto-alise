'use client';
import { Button as RACButton, type ButtonProps as RACButtonProps, composeRenderProps } from 'react-aria-components';
import { ProgressCircle } from './ProgressCircle';
import './Button.sass';

interface ButtonProps extends RACButtonProps {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'pill' | 'square';
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', shape = 'default' } = props;

  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className) =>
        ['react-aria-Button', 'button-base', className].filter(Boolean).join(' '),
      )}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
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
