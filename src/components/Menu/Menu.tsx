import styles from './Menu.module.sass';
import { useEffect, useState } from 'react';
import { Separator } from '../../components-ui/Separator';
import { useAnalytics } from '../../hooks/useAnalytics';


export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isLowGraphics: boolean;
  onToggleLowGraphics: () => void;
  onResetAllData: () => void;
}

export function Menu({ isOpen, onClose, onNavigate, isLowGraphics, onToggleLowGraphics, onResetAllData }: MenuProps) {
  const [isReady, setIsReady] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div className={`${styles.menu} ${isOpen ? styles['is-active'] : ''} ${isReady ? styles['is-ready'] : ''}`}>
      <ul className={styles.menuList}>
        <h6>WELCOME TO</h6>
        <h6>TOKYO</h6>

        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
              trackEvent('nav_open_shop');
              onNavigate('/shop');
              onClose();
            }}
          >
            SHOP
          </div>
        </li>
        <Separator />
        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
              trackEvent('nav_open_admin');
              onNavigate('/admin');
              onClose();
            }}
          >
            ADMIN
          </div>
        </li>
        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            style={{ color: 'var(--neon-pink)', opacity: 0.8 }}
            onClick={onResetAllData}
          >
            RESET ALL DATA
          </div>
        </li>
        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
              trackEvent('nav_open_stats');
              onNavigate('/stats');
              onClose();
            }}
          >
            STATS
          </div>
        </li>
        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
              onNavigate('/sandbox');
              onClose();
            }}
          >
            UI Sandbox
          </div>
        </li>
        <Separator />
        <li className={styles.menuItem}>
          <button type="button" className={`${styles.liInner} ${styles.menuToggle}`} onClick={onToggleLowGraphics}>
            LOW GRAPHICS: {isLowGraphics ? 'ON' : 'OFF'}
          </button>
        </li>
      </ul>
    </div>
  );
}
