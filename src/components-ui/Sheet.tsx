'use client';
import { Modal, ModalOverlay, type ModalOverlayProps, composeRenderProps } from 'react-aria-components';
import { Dialog } from './additional/Dialog';
import './Sheet.sass';

export function Sheet(props: ModalOverlayProps) {
  return (
    <ModalOverlay className="sheet-overlay">
      {composeRenderProps(props.children, (children) => (
        <Modal className="sheet">
          <Dialog>{children}</Dialog>
        </Modal>
      ))}
    </ModalOverlay>
  );
}
