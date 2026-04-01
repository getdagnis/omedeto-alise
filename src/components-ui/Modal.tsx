'use client';
import { Modal as RACModal, type ModalOverlayProps } from 'react-aria-components';
import './Modal.sass';

export function Modal(props: ModalOverlayProps) {
  return <RACModal {...props} />;
}
