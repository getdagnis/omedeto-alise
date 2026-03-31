import {
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  Text,
} from 'react-aria-components';
import type { ToastProps } from 'react-aria-components';
import { Button } from '../components-ui/Button';
import { X } from 'lucide-react';
import styles from './Toast.module.sass';
import { queue } from './ToastQueue';
import type { MyToastContent } from './ToastQueue';
import type { CSSProperties } from 'react';

export function MyToastRegion() {
  return (
    <ToastRegion queue={queue}>
      {({ toast }) => (
        <MyToast toast={toast} style={{ viewTransitionName: toast.key } as CSSProperties}>
          <ToastContent>
            <Text slot="title">{toast.content.title}</Text>
            {toast.content.description && <Text slot="description">{toast.content.description}</Text>}
          </ToastContent>
          <Button slot="close" aria-label="Close" variant="quiet">
            <X size={16} />
          </Button>
        </MyToast>
      )}
    </ToastRegion>
  );
}

export function MyToast(props: ToastProps<MyToastContent>) {
  return <Toast {...props} />;
}
