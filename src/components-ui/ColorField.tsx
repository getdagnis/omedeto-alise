import { ColorField as AriaColorField, Input } from 'react-aria-components';
import type { ColorFieldProps as AriaColorFieldProps, ValidationResult } from 'react-aria-components';
import {Label, FieldError, Description} from './Form';

import styles from './ColorField.module.sass';

export interface ColorFieldProps extends AriaColorFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string
}

export function ColorField(
  { label, description, errorMessage, placeholder, ...props }: ColorFieldProps
) {
  return (
    (
      <AriaColorField {...props}>
        {label && <Label>{label}</Label>}
        <Input className={`${styles['react-aria-Input']} inset`} placeholder={placeholder} />
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaColorField>
    )
  );
}
