import { DateRangePicker as AriaDateRangePicker, Group } from 'react-aria-components';
import type {
  DateValue,
  DateRangePickerProps as AriaDateRangePickerProps,
  ValidationResult,
} from 'react-aria-components';
import { DateInput, DateSegment } from './DateField';
import { Description, FieldButton } from './Form';
import { Popover } from '../components/Popover';
import { Label, FieldError } from './Form';
import { RangeCalendar } from './RangeCalendar';
import { ChevronDown } from 'lucide-react';
import styles from './DateRangePicker.module.sass';

export interface DateRangePickerProps<T extends DateValue> extends AriaDateRangePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker {...props}>
      <Label>{label}</Label>
      <Group className={`${styles['react-aria-Group']} inset`}>
        <div className={`date-fields`}>
          <DateInput slot="start">{(segment) => <DateSegment segment={segment} />}</DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end">{(segment) => <DateSegment segment={segment} />}</DateInput>
        </div>
        <FieldButton>
          <ChevronDown />
        </FieldButton>
      </Group>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <RangeCalendar />
      </Popover>
    </AriaDateRangePicker>
  );
}
