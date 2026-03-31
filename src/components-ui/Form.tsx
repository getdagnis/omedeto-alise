import { Form as RACForm, Label as RACLabel, FieldError as RACFieldError, Button } from 'react-aria-components';
import type { FormProps, LabelProps, FieldErrorProps, ButtonProps, TextProps } from 'react-aria-components';
import { Text } from './Content';
import styles from './Form.module.sass';

export function Form(props: FormProps) {
  return <RACForm {...props} className={styles['react-aria-Form']} />;
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} className={styles['react-aria-Label']} />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} className={styles['react-aria-FieldError']} />;
}

export function Description(props: TextProps) {
  return <Text slot="description" {...props} className={styles['field-description']} />;
}

export function FieldButton(props: ButtonProps) {
  return <Button {...props} className={styles['field-Button']} />;
}
