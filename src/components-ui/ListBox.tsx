'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  composeRenderProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxLoadMoreItemProps,
  type ListBoxProps,
  type ListBoxSectionProps,
} from 'react-aria-components';
import { ArrowRight, Check, ChevronDown, Heart, Minus } from 'lucide-react';
import { Text } from './Content';
import { ProgressCircle } from './ProgressCircle';
import './ListBox.sass';

export function ListBox<T extends object>({ children, ...props }: ListBoxProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const checkScroll = () => {
        setCanScroll(el.scrollHeight > el.clientHeight && el.scrollTop < el.scrollHeight - el.clientHeight - 10);
      };
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [children]);

  return (
    <div className="react-aria-ListBox-wrapper">
      <AriaListBox {...props} ref={scrollRef}>
        {children}
      </AriaListBox>
      {canScroll && (
        <div className="react-aria-ListBox-scroll-indicator">
          <ChevronDown size={16} />
        </div>
      )}
    </div>
  );
}

export interface ListBoxItemProps extends AriaListBoxItemProps {
  action?: React.ReactNode;
  isUsed?: boolean;
}

export function ListBoxItem({ action, isUsed, ...props }: ListBoxItemProps) {
  const textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className, { isSelected, isFocused, isDisabled }) =>
        [
          'react-aria-ListBoxItem',
          isUsed && 'is-used',
          isSelected && 'is-selected',
          isFocused && 'is-focused',
          isDisabled && 'is-disabled',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      )}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <div className="react-aria-ListBoxItem-content">
            {typeof children === 'string' ? <Text slot="label">{children}</Text> : children}
          </div>
          {isSelected && !isUsed && (
            <div className="listbox-item-actions">
              <div className="react-aria-ListBoxItem-action">
                <Heart size={14} />
              </div>
              <div className="react-aria-ListBoxItem-action lucide-arrow">
                <ArrowRight size={16} />
              </div>
            </div>
          )}
          {isUsed && (
            <div className="react-aria-ListBoxItem-action is-used">
              <Minus size={16} />
            </div>
          )}
          {!isSelected && !isUsed && action && <div className="react-aria-ListBoxItem-action">{action}</div>}
        </>
      ))}
    </AriaListBoxItem>
  );
}

export function ListBoxSection<T extends object>(props: ListBoxSectionProps<T>) {
  return <AriaListBoxSection {...props} />;
}

export function ListBoxLoadMoreItem(props: ListBoxLoadMoreItemProps) {
  return (
    <AriaListBoxLoadMoreItem {...props}>
      <ProgressCircle isIndeterminate aria-label="Loading more..." />
    </AriaListBoxLoadMoreItem>
  );
}

export function DropdownListBox<T extends object>(props: ListBoxProps<T>) {
  return <AriaListBox {...props} className="dropdown-listbox" />;
}

export function DropdownItem(props: ListBoxItemProps) {
  const textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <ListBoxItem {...props} textValue={textValue} className="dropdown-item">
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          {isSelected && <Check />}
          {typeof children === 'string' ? <Text slot="label">{children}</Text> : children}
        </>
      ))}
    </ListBoxItem>
  );
}
