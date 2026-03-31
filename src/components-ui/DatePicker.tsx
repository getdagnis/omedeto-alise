import { DatePicker as AriaDatePicker, Group } from 'react-aria-components';
import type { DateValue, DatePickerProps as AriaDatePickerProps, ValidationResult } from 'react-aria-components';
import { DateInput, DateSegment } from './DateField';
import { Label, FieldError, Description } from './Form';
import { FieldButton } from './Form';
import { Calendar } from '../components/Calendar';
import { Popover } from '../components/Popover';
import { ChevronDown } from 'lucide-react';

import styles from './DatePicker.module.sass';

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({ label, description, errorMessage, ...props }: DatePickerProps<T>) {
  return (
    <AriaDatePicker {...props}>
      <Label>{label}</Label>
      <Group>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
        <FieldButton>
          <ChevronDown />
        </FieldButton>
      </Group>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
