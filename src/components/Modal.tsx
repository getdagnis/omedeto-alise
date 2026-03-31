import { Modal as RACModal } from 'react-aria-components';
import type { ModalOverlayProps } from 'react-aria-components';
import styles from './Modal.module.sass';

export function Modal(props: ModalOverlayProps) {
  return <RACModal {...props} />;
}
