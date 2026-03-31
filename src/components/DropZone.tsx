import { DropZone as RACDropZone } from 'react-aria-components';
import type { DropZoneProps } from 'react-aria-components';
import styles from './DropZone.module.sass';

export function DropZone(props: DropZoneProps) {
  return <RACDropZone {...props} className={styles['react-aria-DropZone']} />;
}
