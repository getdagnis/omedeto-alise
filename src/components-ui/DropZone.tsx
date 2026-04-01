'use client';
import { type DropZoneProps, DropZone as RACDropZone } from 'react-aria-components';
import './DropZone.sass';

export function DropZone(props: DropZoneProps) {
  return <RACDropZone {...props} />;
}
