import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
} from 'react-aria-components';
import type {
  DateValue,
  DateFieldProps as AriaDateFieldProps,
  DateInputProps,
  DateSegmentProps,
  ValidationResult,
} from 'react-aria-components';
import { Label, FieldError, Description } from './Form';
import styles from './DateField.module.sass';

export interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateField<T extends DateValue>({ label, description, errorMessage, ...props }: DateFieldProps<T>) {
  return (
    <AriaDateField {...props}>
      <Label>{label}</Label>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}

export function DateSegment(props: DateSegmentProps) {
  return <AriaDateSegment {...props} />;
}

export function DateInput(props: DateInputProps) {
  return <AriaDateInput {...props} className={`${styles['react-aria-DateInput']} inset`} />;
}
