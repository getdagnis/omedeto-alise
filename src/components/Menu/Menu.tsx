import styles from "./Menu.module.sass";
import { useEffect, useState } from "react";

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  renderMode: 'stable' | 'glitch';
  onToggleGlitch: () => void;
}

export function Menu({ isOpen, onClose, renderMode, onToggleGlitch }: MenuProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  return (
    <div
      className={`${styles.menu} ${isOpen ? styles["is-active"] : ""} ${
        isReady ? styles["is-ready"] : ""
      }`}
    >
      <ul className={styles.menuList}>
        <h6>OMEDETO</h6>
        <h6>ALISE</h6>
        <h6>MENU</h6>
        
        <li className={styles.menuItem}>
          <div
            className={styles.liInner}
            onClick={() => {
              onToggleGlitch();
              // No close here to match original behavior if desired, 
              // but usually menus close on action. 
              // Original code didn't close it immediately.
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
