import type { CSSProperties, DragEvent } from 'react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faMusic, faPen, faRotateLeft, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
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
  isMuted?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: () => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
  onImageLoad?: () => void;
  onEdit?: () => void;
  onReset?: () => void;
  onOpenSoundPicker?: () => void;
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
  isMuted = false,
  onSelect,
  onToggleFavorite,
  onDragOver,
  onDragLeave,
  onDrop,
  onImageLoad,
  onEdit,
  onReset,
  onOpenSoundPicker,
  isSmallPreview = false,
  hideSounds = false,
  showActions = true,
  children,
  forceLoop = false,
}: CharacterCardProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const displayName = customization.name?.trim() || character.name;
  const displayImage = customization.image || character.img;
  const showName = displayName.trim().length > 0;
  const soundNames = soundIds.map((soundId) => soundCatalogById.get(soundId)?.name ?? soundId);
  const isLooping = (soundIds.length > 0 || forceLoop) && colors.length > 1;

  // Pulse only if playing and not muted
  const soundsPlayingAndNotMuted = soundIds.length > 0 && !isMuted;
  const pulseClass = soundsPlayingAndNotMuted ? getDropTargetPulseClass(soundIds, soundCatalogById) : '';

  // Greyed out UNLESS:
  // a) sounds are playing and not muted
  // b) is favorited (passed as isActive here from CharacterGrid)
  // c) forced loop (edit mode preview)
  const isGreyedOut = !(soundsPlayingAndNotMuted || isActive || forceLoop);

  const handleCharacterClick = () => {
    if (soundIds.length === 0) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1500);
    } else if (onSelect) {
      onSelect();
    }
  };

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
    <div
      className={`${styles.characterCard} ${isGreyedOut ? styles.characterCardMuted : ''}`}
      style={
        {
          '--character-bg': colors[0],
          '--character-bg-1': colors[0],
          '--character-bg-2': colors[1] || colors[0],
          '--character-bg-3': colors[2] || colors[1] || colors[0],
          '--character-primary': colors[0],
          '--character-secondary': colors[0],
          '--character-title': colors[0],
          '--ring-color': ringColor,
          color: colors[0],
        } as CSSProperties
      }
    >
      {showName && <p className={styles.characterName}>{displayName.toUpperCase()}'S MIX</p>}
      
      <div
        className={`${styles.dropTarget} ${pulseClass} ${isDropActive ? styles.dropTargetActive : ''} ${
          isActive ? styles.dropTargetSelected : ''
        } ${isGlowBurst && isActive ? styles.dropTargetGlow : ''} ${isLooping ? styles.dropTargetHasLoop : ''} ${
          forceLoop && isLooping ? styles.dropTargetHasLoopFast : ''
        }`}
        data-character-id={character.id}
        onClick={handleCharacterClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
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
        
        {/* Favorite Heart Button */}
        {showActions && (
          <button 
            type="button" 
            className={`${styles.favoriteButton} ${isActive ? styles.favoriteButtonActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite();
            }}
            aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
          >
            <FontAwesomeIcon icon={isActive ? faHeartSolid : faHeartRegular} />
          </button>
        )}

        {/* Muted Icon Overlay (Only if sounds are active) */}
        {isMuted && soundIds.length > 0 && (
          <div className={styles.mutedOverlay}>
            <FontAwesomeIcon icon={faVolumeXmark} />
          </div>
        )}

        {children !== undefined ? (
          children
        ) : (
          <>
            <img
              className={`${styles.characterImage} ${!isImageLoaded ? styles.characterImageHidden : ''}`}
              src={displayImage}
              alt={`${displayName} character`}
              onLoad={onImageLoad}
            />
            <img className={styles.characterPlaceholder} src={CHARACTER_PLACEHOLDER_PATH} alt="" aria-hidden="true" />
          </>
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
                {soundName || ''}
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
          <button
            type="button"
            className={`${styles.characterActionButton} ${isFlashing ? styles.actionButtonFlash : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSoundPicker) onOpenSoundPicker();
            }}
            aria-label="Add sounds"
          >
            <FontAwesomeIcon icon={faMusic} />
          </button>
          {soundIds.length > 0 && (
            <button
              type="button"
              className={styles.characterActionButton}
              onClick={(e) => {
                e.stopPropagation();
                if (onReset) onReset();
              }}
              aria-label="Reset character"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterCard;
