import type { HTMLAttributes } from 'react';
import './Chip.sass';

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'danger';
  size?: 'sm' | 'md';
  isActive?: boolean;
};

export function Chip({
  tone = 'neutral',
  size = 'sm',
  isActive = false,
  className,
  ...props
}: ChipProps) {
  return (
    <span
      {...props}
      className={['app-Chip', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-size={size}
      data-active={isActive ? 'true' : undefined}
    />
  );
}
