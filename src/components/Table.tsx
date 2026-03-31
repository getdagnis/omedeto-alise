import { Button, Collection, Column as AriaColumn, Row as AriaRow, Table as AriaTable, TableHeader as AriaTableHeader, useTableOptions, TableBody as AriaTableBody, Cell as AriaCell, ColumnResizer, Group, TableLoadMoreItem as AriaTableLoadMoreItem } from 'react-aria-components';
import type { ColumnProps as AriaColumnProps, RowProps, TableHeaderProps, TableProps, TableBodyProps, CellProps, TableLoadMoreItemProps } from 'react-aria-components';
import {Checkbox} from '../components-ui/Checkbox';
import {ProgressCircle} from '../components-ui/ProgressCircle';
import {ChevronUp, ChevronDown, GripVertical} from 'lucide-react';
import styles from './Table.module.sass';

export function Table(props: TableProps) {
  return <AriaTable {...props} />;
}

interface ColumnProps extends AriaColumnProps {
  allowsResizing?: boolean
}

export function Column(
  props: Omit<ColumnProps, 'children'> & { children?: React.ReactNode }
) {
  return (
    <AriaColumn {...props} className={`${styles['react-aria-Column']} button-base`}>
      {({ allowsSorting, sortDirection }) => (
        <div className={`column-header`}>
          <Group
            role="presentation"
            tabIndex={-1}
            className={`column-name`}>
            {props.children}
          </Group>
          {allowsSorting && (
            <span aria-hidden="true" className={`sort-indicator`}>
              {sortDirection === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
          {props.allowsResizing && <ColumnResizer />}
        </div>
      )}
    </AriaColumn>
  );
}

export function TableHeader<T extends object>(
  { columns, children, ...otherProps }: TableHeaderProps<T>
) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  return (
    (
      <AriaTableHeader {...otherProps}>
        {/* Add extra columns for drag and drop and selection. */}
        {allowsDragging && <AriaColumn width={20} minWidth={20} style={{width: 20}} className={`${styles['react-aria-Column']} button-base`} />}
        {selectionBehavior === 'toggle' && (
          <AriaColumn width={32} minWidth={32} style={{width: 32}} className={`${styles['react-aria-Column']} button-base`}>
            {selectionMode === 'multiple' && <Checkbox slot="selection" />}
          </AriaColumn>
        )}
        <Collection items={columns}>
          {children}
        </Collection>
      </AriaTableHeader>
    )
  );
}

export function Row<T extends object>(
  { id, columns, children, ...otherProps }: RowProps<T>
) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    (
      <AriaRow id={id} {...otherProps}>
        {allowsDragging && (
          <Cell>
            <Button slot="drag" className={`drag-button`}><GripVertical /></Button>
          </Cell>
        )}
        {selectionBehavior === 'toggle' && (
          <Cell>
            <Checkbox slot="selection" />
          </Cell>
        )}
        <Collection items={columns}>
          {children}
        </Collection>
      </AriaRow>
    )
  );
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function Cell(props: CellProps) {
  return <AriaCell {...props} />;
}

export function TableLoadMoreItem(props: TableLoadMoreItemProps) {
  return (
    <AriaTableLoadMoreItem {...props}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <ProgressCircle isIndeterminate aria-label="Loading more..." />
      </div>
    </AriaTableLoadMoreItem>
  );
}
