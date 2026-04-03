import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import styles from './SoundBar.module.sass';

export type SoundBarProps = {
  name: string;
  colorToken?: string;
  isPreviewing?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPreview?: () => void;
  onSelect?: () => void;
  actions?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function SoundBar({
  name,
  colorToken,
  isPreviewing = false,
  isSelected = false,
  isDisabled = false,
  onPreview,
  onSelect,
  actions,
  className = '',
  size = 'md',
}: SoundBarProps) {
  const style = isSelected && colorToken ? ({ '--sound-color': `var(${colorToken})` } as CSSProperties) : {};

  return (
    <div
      className={`${styles.soundBar} ${isSelected ? styles.isSelected : ''} ${
        isPreviewing ? styles.isPreviewing : ''
      } ${isDisabled ? styles.isDisabled : ''} ${styles[`size-${size}`]} ${className}`}
      style={style}
    >
      <button
        type="button"
        className={`${styles.previewButton} ${isPreviewing ? styles.isPreviewing : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onPreview?.();
        }}
        aria-label={isPreviewing ? 'Stop preview' : 'Preview sound'}
      >
        <FontAwesomeIcon icon={faVolumeHigh} />
      </button>

      <button type="button" className={styles.selectButton} onClick={onSelect} disabled={isDisabled}>
        <span className={styles.name}>{name.toUpperCase()}</span>
      </button>

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
