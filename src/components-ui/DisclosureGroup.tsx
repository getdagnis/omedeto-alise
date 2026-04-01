'use client';
import { DisclosureGroup as RACDisclosureGroup, type DisclosureGroupProps } from 'react-aria-components';
import './DisclosureGroup.sass';

export function DisclosureGroup(props: DisclosureGroupProps) {
  return <RACDisclosureGroup {...props} />;
}
