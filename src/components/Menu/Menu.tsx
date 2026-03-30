import styles from './Menu.module.sass';
import { useEffect, useState } from 'react';

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  renderMode: 'stable' | 'glitch';
  onToggleGlitch: () => void;
  onNavigate: (path: string) => void;
}

export function Menu({ isOpen, onClose, renderMode, onToggleGlitch, onNavigate }: MenuProps) {
  const [isReady, setIsReady] = useState(false);

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
              onNavigate('/shop');
              onClose();
            }}
          >
            SHOP
          </div>
        </li>

        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
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
            onClick={() => {
              onToggleGlitch();
            }}
          >
            GLITCH: {renderMode === 'glitch' ? 'OFF' : 'ON'}
          </div>
        </li>

        {/* Placeholder for other items if needed */}
        <li className={styles.menuItem}>
          <div className={styles.liInner} onClick={onClose}>
            CLOSE
          </div>
        </li>
      </ul>
    </div>
  );
}
