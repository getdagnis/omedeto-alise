import { Input, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps, ValidationResult } from 'react-aria-components';
import {Label, FieldError, Description} from './Form';
import styles from './TextField.module.sass';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string
}

export function TextField(
  { label, description, errorMessage, placeholder, ...props }: TextFieldProps
) {
  return (
    <AriaTextField {...props}>
      <Label>{label}</Label>
      <Input className={`${styles['react-aria-Input']} inset`} placeholder={placeholder} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
