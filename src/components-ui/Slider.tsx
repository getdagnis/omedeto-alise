import { Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components';
import type { SliderProps as AriaSliderProps } from 'react-aria-components';
import {Label} from './Form';
import styles from './Slider.module.sass';
import React from 'react';

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export function Slider<T extends number | number[]>(
  { label, thumbLabels, ...props }: SliderProps<T>
) {
  return (
    (
      <AriaSlider {...props}>
        {label && <Label>{label}</Label>}
        <SliderOutput>
          {({ state }) =>
            state.values.map((_, i) => state.getThumbValueLabel(i)).join(' – ')}
        </SliderOutput>
        <SliderTrack>
          {({ state, isDisabled }) => (<>
            <div className={`track inset`} data-disabled={isDisabled || undefined}>
              {state.values.length === 1
                // Single thumb, render fill from the end
                ? <div className={`fill`} style={{'--size': state.getThumbPercent(0) * 100 + '%'} as React.CSSProperties} />
                : state.values.length === 2
                  // Range slider, render fill between the thumbs
                  ? <div className={`fill`} style={{'--start': state.getThumbPercent(0) * 100 + '%', '--size': (state.getThumbPercent(1) - state.getThumbPercent(0)) * 100 + '%'} as React.CSSProperties} />
                  : null}
            </div>
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} className={`${styles['react-aria-SliderThumb']} indicator`} />
            ))}
          </>)}
        </SliderTrack>
      </AriaSlider>
    )
  );
}
