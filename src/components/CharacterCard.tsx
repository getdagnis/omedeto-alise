import type { CSSProperties, DragEvent } from 'react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './CharacterCard.module.sass';
import type { CharacterOption, SoundOption } from '../config';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';

type CharacterCustomization = {
  name?: string;
  colorMode?: 'auto' | string;
  image?: string;
};

type CharacterCardProps = {
  character: CharacterOption;
  customization: CharacterCustomization;
  soundIds: string[];
  soundCatalogById: Map<string, SoundOption>;
  isActive: boolean;
  isDropActive: boolean;
  isGlowBurst: boolean;
  comboWord: string | null;
  backgroundColor: string;
  ringColor: string;
  isImageLoaded: boolean;
  onSelect?: () => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: () => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
  onImageLoad?: () => void;
  onEdit?: () => void;
  onReset?: () => void;
  isSmallPreview?: boolean;
  hideSounds?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

const getDropTargetPulseClass = (soundIds: string[], soundCatalogById: Map<string, SoundOption>) => {
  if (soundIds.length === 0) {
    return '';
  }

  const hasFastAnimation = soundIds.some((soundId) => {
    const animation = soundCatalogById.get(soundId)?.animation;
    return animation === 'fast' || animation === 'both';
  });
  const hasSlowAnimation = soundIds.some((soundId) => {
    const animation = soundCatalogById.get(soundId)?.animation;
    return animation === 'slow' || animation === 'both';
  });

  if (hasFastAnimation && hasSlowAnimation) {
    return styles.dropTargetPulseBoth;
  }

  if (hasFastAnimation) {
    return styles.dropTargetPulseFast;
  }

  return styles.dropTargetPulseSlow;
};

function CharacterCard({
  character,
  customization,
  soundIds,
  soundCatalogById,
  isActive,
  isDropActive,
  isGlowBurst,
  comboWord,
  backgroundColor,
  ringColor,
  isImageLoaded,
  onSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onImageLoad,
  onEdit,
  onReset,
  isSmallPreview = false,
  hideSounds = false,
  actions,
  children,
}: CharacterCardProps) {
  const displayName = customization.name?.trim() || character.name;
  const displayImage = customization.image || character.img;
  const showName = displayName.trim().length > 0;
  const pulseClass = getDropTargetPulseClass(soundIds, soundCatalogById);
  const soundNames = soundIds.map((soundId) => soundCatalogById.get(soundId)?.name ?? soundId);

  if (isSmallPreview) {
    return (
      <button
        type="button"
        className={`${styles.smallPreview} ${isActive ? styles.smallPreviewActive : ''}`}
        onClick={onSelect}
        style={{ '--preview-color': backgroundColor } as CSSProperties}
      >
        <img src={displayImage} alt={displayName} className={styles.smallPreviewImage} />
        <span className={styles.smallPreviewName}>{displayName}</span>
      </button>
    );
  }

  return (
    <div className={styles.characterCard}>
      <div
        className={`${styles.dropTarget} ${pulseClass} ${isDropActive ? styles.dropTargetActive : ''} ${
          isActive ? styles.dropTargetSelected : ''
        } ${isGlowBurst && isActive ? styles.dropTargetGlow : ''}`}
        data-character-id={character.id}
        onClick={onSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={
          {
            '--character-bg': backgroundColor,
            '--character-primary': backgroundColor,
            '--character-secondary': backgroundColor,
            '--ring-color': ringColor,
          } as CSSProperties
        }
      >
        {comboWord && isActive && (
          <div className={styles.comboWord} role="status" aria-live="polite">
            {comboWord}
          </div>
        )}
        {children !== undefined ? (
          children
        ) : (
          <div className={styles.characterImageWrap}>
            {!isImageLoaded && (
              <img className={styles.characterPlaceholder} src={CHARACTER_PLACEHOLDER_PATH} alt="" aria-hidden="true" />
            )}
            <img
              className={`${styles.characterImage} ${!isImageLoaded ? styles.characterImageHidden : ''}`}
              src={displayImage}
              alt={`${displayName} character`}
              onLoad={onImageLoad}
            />
          </div>
        )}
      </div>
      {showName && <p className={styles.characterName}>{displayName}</p>}
      {!hideSounds && (
        <div className={styles.characterSoundList}>
          {soundNames.length === 0 ? (
            <span className={styles.characterSoundTag}>No sounds</span>
          ) : (
            soundNames.map((name) => (
              <span key={`${character.id}-${name}`} className={styles.characterSoundTag}>
                {name}
              </span>
            ))
          )}
        </div>
      )}
      <div className={styles.characterActions}>
        {actions || (
          <>
            <button type="button" className={styles.characterActionButton} onClick={onEdit} aria-label="Edit character">
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button
              type="button"
              className={styles.characterActionButton}
              onClick={onReset}
              aria-label="Reset character"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CharacterCard;
