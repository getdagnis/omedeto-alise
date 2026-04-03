import type { HTMLAttributes } from 'react';
import './Chip.sass';

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'danger' | 'title';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  font?: 'body' | 'goofy';
  maxLength?: number;
};

export function Chip({
  tone = 'neutral',
  size = 'sm',
  isActive = false,
  font = 'body',
  maxLength = 12,
  children,
  className,
  ...props
}: ChipProps) {
  const truncatedChildren = typeof children === 'string' && children.length > maxLength
    ? children.slice(0, maxLength - 2) + '…'
    : children;

  return (
    <span
      {...props}
      className={['app-Chip', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-size={size}
      data-font={font}
      data-active={isActive ? 'true' : undefined}
    >
      {truncatedChildren}
    </span>
  );
}
