import { Button, Tag as AriaTag, TagGroup as AriaTagGroup, TagList,  } from 'react-aria-components';
import type { TagGroupProps as AriaTagGroupProps, TagListProps, TagProps } from 'react-aria-components';
import {Description, Label} from './Form';
import {Text} from './Content';
import {X} from 'lucide-react';
import styles from './TagGroup.module.sass';

export interface TagGroupProps<T>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    ...props
  }: TagGroupProps<T>
) {
  return (
    (
      <AriaTagGroup {...props}>
        {label && <Label>{label}</Label>}
        <TagList items={items} renderEmptyState={renderEmptyState}>
          {children}
        </TagList>
        {description && <Description>{description}</Description>}
        {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
      </AriaTagGroup>
    )
  );
}

export function Tag(
  { children, ...props }: Omit<TagProps, 'children'> & {
    children?: React.ReactNode;
  }
) {
  const textValue = typeof children === 'string' ? children : undefined;
  return (
    (
      <AriaTag textValue={textValue} {...props} className={`${styles['react-aria-Tag']} button-base`}>
        {({ allowsRemoving }) => (
          <>
            {children}
            {allowsRemoving && <Button slot="remove" className={`remove-button`}><X /></Button>}
          </>
        )}
      </AriaTag>
    )
  );
}
