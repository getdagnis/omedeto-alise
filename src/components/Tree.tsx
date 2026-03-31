import { Button, Tree as AriaTree, TreeItem as AriaTreeItem, TreeItemContent as AriaTreeItemContent, TreeLoadMoreItem as AriaTreeLoadMoreItem, TreeSection as AriaTreeSection, TreeHeader as AriaTreeHeader } from 'react-aria-components';
import type { TreeItemContentProps, TreeItemContentRenderProps, TreeItemProps as AriaTreeItemProps, TreeProps, TreeLoadMoreItemProps } from 'react-aria-components';
import {ChevronRight, GripVertical} from 'lucide-react';
import {Checkbox} from '../components-ui/Checkbox';
import {ProgressCircle} from '../components-ui/ProgressCircle';
import styles from './Tree.module.sass';

export function Tree<T extends object>(props: TreeProps<T>) {
  return <AriaTree {...props} />;
}

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & { children?: React.ReactNode }
) {
  return (
    <AriaTreeItemContent>
      {(
        { selectionBehavior, selectionMode, allowsDragging }:
          TreeItemContentRenderProps
      ) => (
        <>
          {allowsDragging && <Button slot="drag"><GripVertical size={16} /></Button>}
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox slot="selection" />
          )}
          <Button slot="chevron">
            <ChevronRight />
          </Button>
          {props.children}
        </>
      )}
    </AriaTreeItemContent>
  );
}

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  title: React.ReactNode;
}

export function TreeItem(props: TreeItemProps) {
  const textValue = typeof props.title === 'string' ? props.title : '';
  return (
    <AriaTreeItem textValue={textValue} {...props}>
      <TreeItemContent>
        {props.title}
      </TreeItemContent>
      {props.children}
    </AriaTreeItem>
  );
}

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  return (
    <AriaTreeLoadMoreItem {...props}>
      <ProgressCircle isIndeterminate aria-label="Loading more..." />
    </AriaTreeLoadMoreItem>
  );
}

export function TreeSection(
  props: React.ComponentProps<typeof AriaTreeSection>
) {
  return <AriaTreeSection {...props} />;
}

export function TreeHeader(
  props: React.ComponentProps<typeof AriaTreeHeader>
) {
  return <AriaTreeHeader {...props} />;
}
