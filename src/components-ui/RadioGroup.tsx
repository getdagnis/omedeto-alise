import { RadioGroup as AriaRadioGroup, Radio as AriaRadio, composeRenderProps } from 'react-aria-components';
import type { RadioGroupProps as AriaRadioGroupProps, ValidationResult, RadioProps } from 'react-aria-components';
import { Label, FieldError, Description } from './Form';
import styles from './RadioGroup.module.sass';

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup({ label, description, errorMessage, children, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={styles['react-aria-RadioGroup']}>
      <Label>{label}</Label>
      <div className={`radio-items`}>{children}</div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export function Radio(props: RadioProps) {
  return (
    <AriaRadio {...props} className={styles['react-aria-Radio']}>
      {composeRenderProps(props.children, (children) => (
        <>
          <div className={`indicator`} />
          {children}
        </>
      ))}
    </AriaRadio>
  );
}
