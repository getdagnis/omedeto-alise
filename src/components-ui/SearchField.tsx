import { Button, Input, SearchField as AriaSearchField } from 'react-aria-components';
import type { SearchFieldProps as AriaSearchFieldProps, ValidationResult } from 'react-aria-components';
import {Label, FieldError, Description} from './Form';
import {Search, X} from 'lucide-react';
import styles from './SearchField.module.sass';

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export function SearchField(
  { label, description, errorMessage, placeholder, ...props }: SearchFieldProps
) {
  return (
    (
      <AriaSearchField {...props}>
        {label && <Label>{label}</Label>}
        <Search size={18} />
        <Input placeholder={placeholder} className={`${styles['react-aria-Input']} inset`} />
        <Button className={`clear-button`}><X size={14} /></Button>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaSearchField>
    )
  );
}
