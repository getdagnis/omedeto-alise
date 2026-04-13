import styles from './Menu.module.sass';
import { useEffect, useState } from 'react';
import { Separator } from '../../components-ui/Separator';
import { useAnalytics } from '../../hooks/useAnalytics';

import { PROGRESSION_STORAGE_KEY } from '../../hooks/useProgression';

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isLowGraphics: boolean;
  onToggleLowGraphics: () => void;
}

export function Menu({ isOpen, onClose, onNavigate, isLowGraphics, onToggleLowGraphics }: MenuProps) {
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
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear all local data and reset the app? (Your favorite sounds will be preserved)',
                )
              ) {
                // 1. Capture favorites
                let favorites: string[] = [];
                try {
                  const progression = localStorage.getItem(PROGRESSION_STORAGE_KEY);
                  if (progression) {
                    const parsed = JSON.parse(progression);
                    favorites = parsed.favoriteSoundIds || [];
                  }
                } catch (e) {
                  console.error('Failed to capture favorites before reset', e);
                }

                // 2. Wipe everything
                localStorage.clear();

                // 3. Restore favorites into a fresh state
                if (favorites.length > 0) {
                  try {
                    // We use a minimal version of the default state or just the key
                    // useProgression will merge it with DEFAULT_PROGRESSION_STATE on reload
                    localStorage.setItem(
                      PROGRESSION_STORAGE_KEY,
                      JSON.stringify({
                        favoriteSoundIds: favorites,
                      }),
                    );
                  } catch (e) {
                    console.error('Failed to restore favorites', e);
                  }
                }

                window.location.reload();
              }
            }}
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
