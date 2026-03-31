import { ProgressBar as AriaProgressBar } from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import {Label} from './Form';
import styles from './ProgressBar.module.sass';
import React from 'react';

export interface ProgressBarProps extends AriaProgressBarProps {
  label?: string;
}

export function ProgressBar({ label, ...props }: ProgressBarProps) {
  return (
    (
      <AriaProgressBar {...props}>
        {({ percentage, valueText, isIndeterminate }) => (
          <>
            <Label>{label}</Label>
            <span className={`value`}>{valueText}</span>
            <div className={`track inset`}>
              <div className={`fill`} style={{ '--percent': (isIndeterminate ? 100 : percentage) + '%' } as React.CSSProperties} />
            </div>
          </>
        )}
      </AriaProgressBar>
    )
  );
}
