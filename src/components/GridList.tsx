import { Button, GridList as AriaGridList, GridListItem as AriaGridListItem, GridListLoadMoreItem as AriaGridListLoadMoreItem } from 'react-aria-components';
import type { GridListItemProps, GridListProps, GridListLoadMoreItemProps } from 'react-aria-components';
import {Checkbox} from '../components-ui/Checkbox';
import {GripVertical} from 'lucide-react';
import {ProgressCircle} from '../components-ui/ProgressCircle';
import styles from './GridList.module.sass';

export function GridList<T extends object>(
  { children, layout = 'grid', ...props }: GridListProps<T>
) {
  return (
    (
      <AriaGridList {...props} layout={layout}>
        {children}
      </AriaGridList>
    )
  );
}

export function GridListItem(
  { children, ...props }: Omit<GridListItemProps, 'children'> & {
    children?: React.ReactNode;
  }
) {
  const textValue = typeof children === 'string' ? children : undefined;
  return (
    (
      <AriaGridListItem textValue={textValue} {...props}>
        {({ selectionMode, selectionBehavior, allowsDragging }) => (
          <>
            {/* Add elements for drag and drop and selection. */}
            {allowsDragging && <Button slot="drag"><GripVertical size={16} /></Button>}
            {selectionMode === 'multiple' && selectionBehavior === 'toggle' && (
              <Checkbox slot="selection" />
            )}
            {children}
          </>
        )}
      </AriaGridListItem>
    )
  );
}

export function GridListLoadMoreItem(props: GridListLoadMoreItemProps) {
  return (
    <AriaGridListLoadMoreItem {...props}>
      <ProgressCircle isIndeterminate aria-label="Loading more..." />
    </AriaGridListLoadMoreItem>
  );
}
