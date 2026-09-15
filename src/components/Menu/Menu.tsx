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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
              trackEvent('nav_open_stats');
              onNavigate('/stats');
              onClose();
            }}
          >
            STATS
          </div>
        </li>
        <li className={styles.menuItem}>
          <div className={styles.liInner} onClick={() => setIsAboutOpen((open) => !open)}>ABOUT</div>
          {isAboutOpen && <div className={styles.aboutMessage}>I will tell you about it later.</div>}
        </li>
      </ul>
    </div>
  );
}
