'use client';
import type { HTMLAttributes, ReactNode } from 'react';
import { Heading } from './Content';
import './CardSection.sass';

export interface CardSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  children: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  bodyClassName?: string;
  as?: 'section' | 'article' | 'div';
}

export function CardSection({
  title,
  children,
  headingLevel = 3,
  bodyClassName,
  className,
  as = 'section',
  ...props
}: CardSectionProps) {
  const Element = as;

  return (
    <Element className={className ? `card-section ${className}` : 'card-section'} {...props}>
      {title ? (
        <Heading level={headingLevel} className="card-section-title">
          {title}
        </Heading>
      ) : null}
      <div className={bodyClassName ? `card-section-body ${bodyClassName}` : 'card-section-body'}>{children}</div>
    </Element>
  );
}
