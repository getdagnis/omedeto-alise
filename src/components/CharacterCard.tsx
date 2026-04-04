import type { CSSProperties, DragEvent } from 'react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faMusic,
  faPen,
  faRotateLeft,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import styles from './CharacterCard.module.sass';
import type { CharacterOption, SoundOption } from '../config';
import { Button, Chip, Tooltip, TooltipTrigger } from '../components-ui';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const FAV_BUTTON = false;

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
  soundIds?: string[];
};

type CharacterCardProps = {
  character: CharacterOption;
  customization: CharacterCustomization;
  soundIds: string[];
  soundCatalogById: Map<string, SoundOption>;
  isFavorite: boolean;
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
  onEditImage?: () => void;
  onReset?: () => void;
  onOpenSoundPicker?: () => void;
  onToggleSound?: (soundId: string) => void;
  onRemoveSound?: (soundId: string) => void;
  isSmallPreview?: boolean;
  hideSounds?: boolean;
  showActions?: boolean;
  children?: React.ReactNode;
  forceLoop?: boolean;
  size?: 'normal' | 'large';
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
  isFavorite,
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
  onEditImage,
  onReset,
  onOpenSoundPicker,
  onToggleSound,
  onRemoveSound,
  isSmallPreview = false,
  hideSounds = false,
  showActions = true,
  children,
  forceLoop = false,
  size = 'normal',
}: CharacterCardProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const displayName = customization.name?.trim() || character.name;
  const displayImage = customization.image || character.img;
  const showName = displayName.trim().length > 0;
  const isLooping = (soundIds.length > 0 || forceLoop) && colors.length > 1;

  // Pulse only if playing and not muted
  const soundsPlayingAndNotMuted = soundIds.length > 0 && !isMuted;
  const pulseClass = soundsPlayingAndNotMuted ? getDropTargetPulseClass(soundIds, soundCatalogById) : '';

  // Greyed out UNLESS:
  // a) sounds are playing and not muted
  // b) is favorited
  // c) forced loop (edit mode preview)
  const isGreyedOut = !(soundsPlayingAndNotMuted || isFavorite || forceLoop);

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
        className={`${styles.smallPreview} ${isFavorite ? styles.smallPreviewActive : ''}`}
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
      {showName && (
        <Chip tone="title" font="goofy" size="lg" className={styles.characterName}>
          {displayName.toUpperCase()}'S MIX
        </Chip>
      )}

      <div
        className={`${styles.dropTarget} ${pulseClass} ${isDropActive ? styles.dropTargetActive : ''} ${
          isGlowBurst && isFavorite ? styles.dropTargetGlow : ''
        } ${isLooping ? styles.dropTargetHasLoop : ''} ${forceLoop && isLooping ? styles.dropTargetHasLoopFast : ''} ${
          size === 'large' ? styles.dropTargetLarge : styles.dropTargetNormal
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
        {comboWord && isFavorite && (
          <div className={styles.comboWord} role="status" aria-live="polite">
            {comboWord}
          </div>
        )}

        {/* Favorite Heart Button */}
        {showActions && FAV_BUTTON && (
          <button
            type="button"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite();
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} />
          </button>
        )}

        {/* Image Edit Button */}
        {onEditImage && (
          <TooltipTrigger>
            <Button
              type="button"
              variant="action"
              size="sm"
              shape="pill"
              className={styles.imageEditButton}
              onPress={() => {
                onEditImage();
              }}
              aria-label="Change character image"
            >
              <FontAwesomeIcon icon={faPen} />
            </Button>
            <Tooltip>CHANGE IMAGE</Tooltip>
          </TooltipTrigger>
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

        {!hideSounds && customization.soundIds && customization.soundIds.length > 0 && (
          <div className={styles.characterSoundList}>
            {customization.soundIds.map((soundId, index) => {
              const sound = soundCatalogById.get(soundId);
              const soundName = sound?.name ?? soundId;
              const colorToken = sound?.colorToken;
              const isActive = soundIds.includes(soundId);

              return (
                <Chip
                  key={`${character.id}-slot-${index}`}
                  className={`${styles.characterSoundTag} ${!isActive ? styles.soundTagPaused : ''}`}
                  tone="neutral"
                  size="sm"
                  style={
                    isActive && colorToken
                      ? { background: `var(${colorToken})`, color: '#000', borderColor: 'transparent' }
                      : {}
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleSound) onToggleSound(soundId);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveSound) onRemoveSound(soundId);
                  }}
                >
                  {soundName}
                </Chip>
              );
            })}
          </div>
        )}
      </div>

      {showActions && (
        <div className={styles.characterActions}>
          <div className={styles.characterActionWrap}>
            <TooltipTrigger isOpen={isFlashing || undefined}>
              <Button
                type="button"
                variant="action"
                size="sm"
                shape="pill"
                className={styles.characterActionButton}
                onPress={() => {
                  if (onOpenSoundPicker) onOpenSoundPicker();
                }}
                aria-label="Add sounds"
              >
                <FontAwesomeIcon icon={faMusic} />
              </Button>
              <Tooltip>PICK SOME SOUNDS</Tooltip>
            </TooltipTrigger>
          </div>
          <TooltipTrigger>
            <Button
              type="button"
              variant="action"
              size="sm"
              shape="pill"
              className={styles.characterActionButton}
              onPress={onEdit}
              aria-label="Edit character"
            >
              <FontAwesomeIcon icon={faPen} />
            </Button>
            <Tooltip>EDIT CHARACTER</Tooltip>
          </TooltipTrigger>
          {soundIds.length > 0 && (
            <TooltipTrigger>
              <Button
                type="button"
                variant="action"
                size="sm"
                shape="pill"
                className={styles.characterActionButton}
                onPress={() => {
                  if (onReset) onReset();
                }}
                aria-label="Reset character"
              >
                <FontAwesomeIcon icon={faRotateLeft} />
              </Button>
              <Tooltip>RESET CHARACTER</Tooltip>
            </TooltipTrigger>
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterCard;
