import { Dialog as RACDialog, DialogTrigger as RACDialogTrigger } from 'react-aria-components';
import type { DialogProps, DialogTriggerProps } from 'react-aria-components';
import styles from './Dialog.module.sass';

export function Dialog(props: DialogProps) {
  return <RACDialog {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <RACDialogTrigger {...props} />;
}
