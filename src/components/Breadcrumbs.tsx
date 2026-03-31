import { Breadcrumbs as RACBreadcrumbs, Breadcrumb as RACBreadcrumb, Link } from 'react-aria-components';
import type { BreadcrumbsProps, BreadcrumbProps, LinkProps } from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumbs.module.sass';

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return <RACBreadcrumbs {...props} className={styles['react-aria-Breadcrumbs']} />;
}

export function Breadcrumb(props: BreadcrumbProps & Omit<LinkProps, 'className'>) {
  return (
    <RACBreadcrumb {...props} className={styles['react-aria-Breadcrumb']}>
      {({ isCurrent }) => (
        <>
          <Link {...props} className={styles['react-aria-Link']} />
          {!isCurrent && <ChevronRight size={14} className={styles['chevron']} />}
        </>
      )}
    </RACBreadcrumb>
  );
}
