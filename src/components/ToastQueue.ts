import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import { flushSync } from 'react-dom';

export interface MyToastContent {
  title: string;
  description?: string;
}

export const queue = new ToastQueue<MyToastContent>({
  // Wrap state updates in a CSS view transition.
  wrapUpdate(fn) {
    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});
