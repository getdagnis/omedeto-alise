import { Modal, ModalOverlay, composeRenderProps } from 'react-aria-components';
import type { ModalOverlayProps } from 'react-aria-components';
import { Dialog } from './Dialog';
import styles from './Sheet.module.sass';

export function Sheet(props: ModalOverlayProps) {
  return (
    <ModalOverlay className={`sheet-overlay`}>
      {composeRenderProps(props.children, (children) => (
        <Modal className={`sheet`}>
          <Dialog>{children}</Dialog>
        </Modal>
      ))}
    </ModalOverlay>
  );
}
