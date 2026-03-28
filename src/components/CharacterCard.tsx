import type { CSSProperties, DragEvent } from 'react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './CharacterCard.module.sass';
import type { CharacterOption, SoundOption } from '../config';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
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
  colors: string[];
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
  showActions?: boolean;
  children?: React.ReactNode;
  forceLoop?: boolean;
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
  colors,
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
  showActions = true,
  children,
  forceLoop = false,
}: CharacterCardProps) {
  const displayName = customization.name?.trim() || character.name;
  const displayImage = customization.image || character.img;
  const showName = displayName.trim().length > 0;
  const pulseClass = getDropTargetPulseClass(soundIds, soundCatalogById);
  const soundNames = soundIds.map((soundId) => soundCatalogById.get(soundId)?.name ?? soundId);
  const isLooping = (soundIds.length > 0 || forceLoop) && colors.length > 1;

  if (isSmallPreview) {
    return (
      <button
        type="button"
        className={`${styles.smallPreview} ${isActive ? styles.smallPreviewActive : ''}`}
        onClick={onSelect}
        style={{ '--preview-color': colors[0] } as CSSProperties}
      >
        <img src={displayImage} alt={displayName} className={styles.smallPreviewImage} />
        <span className={styles.smallPreviewName}>{displayName}</span>
      </button>
    );
  }

  return (
    <div className={styles.characterCard}>
      {showName && <p className={styles.characterName}>{displayName.toUpperCase()}'S MIX</p>}
      <div
        className={`${styles.dropTarget} ${pulseClass} ${isDropActive ? styles.dropTargetActive : ''} ${
          isActive ? styles.dropTargetSelected : ''
        } ${isGlowBurst && isActive ? styles.dropTargetGlow : ''} ${isLooping ? styles.dropTargetHasLoop : ''} ${
          forceLoop && isLooping ? styles.dropTargetHasLoopFast : ''
        }`}
        data-character-id={character.id}
        onClick={onSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={
          {
            '--character-bg': colors[0],
            '--character-bg-1': colors[0],
            '--character-bg-2': colors[1] || colors[0],
            '--character-bg-3': colors[2] || colors[1] || colors[0],
            '--character-primary': colors[0],
            '--character-secondary': colors[0],
            '--ring-color': ringColor,
            color: colors[0],
          } as CSSProperties
        }
      >
        <div
          className={`${styles.backgroundLoop} ${isLooping ? styles.backgroundLoopActive : ''} ${
            forceLoop ? styles.backgroundLoopFast : ''
          }`}
        />
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
      {!hideSounds && (
        <div className={styles.characterSoundList}>
          {Array.from({ length: 3 }).map((_, index) => {
            const soundName = soundNames[index];
            return (
              <span
                key={`${character.id}-slot-${index}`}
                className={`${styles.characterSoundTag} ${!soundName ? styles.characterSoundTagEmpty : ''}`}
              >
                {soundName || 'add sound'}
              </span>
            );
          })}
        </div>
      )}
      {showActions && (
        <div className={styles.characterActions}>
          <button type="button" className={styles.characterActionButton} onClick={onEdit} aria-label="Edit character">
            <FontAwesomeIcon icon={faPen} />
          </button>
          {soundIds.length > 0 && (
            <button type="button" className={styles.characterActionButton} onClick={onReset} aria-label="Reset character">
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterCard;
