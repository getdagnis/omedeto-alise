import { TimeField as AriaTimeField } from 'react-aria-components';
import type { TimeFieldProps as AriaTimeFieldProps, ValidationResult, TimeValue } from 'react-aria-components';
import { Label, FieldError, Description } from './Form';
import { DateInput, DateSegment } from './DateField';
import styles from './TimeField.module.sass';

export interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TimeField<T extends TimeValue>({ label, description, errorMessage, ...props }: TimeFieldProps<T>) {
  return (
    <AriaTimeField {...props}>
      <Label>{label}</Label>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTimeField>
  );
}
