import type { CSSProperties, DragEvent } from 'react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  UserRoundPen, 
  Play, 
  Pause, 
  Shuffle, 
  Heart
} from 'lucide-react';
import styles from './CharacterCard.module.sass';
import type { CharacterOption, SoundOption } from '../config';
import { Button, Chip, Tooltip, TooltipTrigger } from '../components-ui';
import { useAnalytics } from '../hooks/useAnalytics';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const FAV_BUTTON = false;

// Magic numbers for animations
const HINT_FLASH_DURATION = 500; // 0.5s
const HINT_PROGRESSIVE_DELAY = 100; // 0.1s
const ENTRANCE_FLASH_DELAY = 200; // 0.2s
const TOOLTIP_EXTRA_DURATION = 1500; // extra time to keep the "ACTIVATE!" hint visible

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
  isMain?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: () => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
  onImageLoad?: () => void;
  onShuffle?: () => void;
  onToggleSound?: (soundId: string) => void;
  onRemoveSound?: (soundId: string) => void;
  onToggleMute?: () => void;
  onOpenProfile?: () => void;
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
  isMain = false,
  onSelect,
  onToggleFavorite,
  onDragOver,
  onDragLeave,
  onDrop,
  onImageLoad,
  onShuffle,
  onToggleSound,
  onRemoveSound,
  onToggleMute,
  onOpenProfile,
  isSmallPreview = false,
  hideSounds = false,
  showActions = true,
  children,
  forceLoop = false,
  size = 'normal',
}: CharacterCardProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [hintingIds, setHintingIds] = useState<Set<string>>(new Set());
  const [showHintTooltip, setShowHintTooltip] = useState(false);
  const prevSoundIdsLengthRef = useRef(customization.soundIds?.length ?? 0);
  const { trackEvent } = useAnalytics();
  
  const displayName = customization.name?.trim() || character.name;
  const displayImage = customization.image || character.img;
  const soundsPlayingAndNotMuted = soundIds.length > 0 && !isMuted;
  const isLooping = soundsPlayingAndNotMuted;
  const pulseClass = soundsPlayingAndNotMuted ? getDropTargetPulseClass(soundIds, soundCatalogById) : '';

  const isGreyedOut = !(soundsPlayingAndNotMuted || isFavorite || forceLoop || isMain);

  // Entrance flash when sounds are added
  useEffect(() => {
    const currentLen = customization.soundIds?.length ?? 0;
    if (currentLen > prevSoundIdsLengthRef.current) {
       customization.soundIds?.forEach((id, index) => {
         setTimeout(() => {
           setHintingIds(prev => new Set(prev).add(id));
           setTimeout(() => {
             setHintingIds(prev => {
               const next = new Set(prev);
               next.delete(id);
               return next;
             });
           }, HINT_FLASH_DURATION);
         }, index * ENTRANCE_FLASH_DELAY);
       });
    }
    prevSoundIdsLengthRef.current = currentLen;
  }, [customization.soundIds]);

  const triggerSoundHint = useCallback(() => {
    if (customization.soundIds && customization.soundIds.length > 0) {
      setShowHintTooltip(true);
      setTimeout(() => setShowHintTooltip(false), customization.soundIds.length * HINT_PROGRESSIVE_DELAY + HINT_FLASH_DURATION + TOOLTIP_EXTRA_DURATION);
      
      customization.soundIds.forEach((id, index) => {
        setTimeout(() => {
          setHintingIds(prev => new Set(prev).add(id));
          setTimeout(() => {
            setHintingIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }, HINT_FLASH_DURATION);
        }, index * HINT_PROGRESSIVE_DELAY);
      });
    }
  }, [customization.soundIds]);

  const handleTogglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!customization.soundIds || customization.soundIds.length === 0) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1500);
      return;
    }

    if (soundIds.length === 0) {
       triggerSoundHint();
       return;
    }
    
    if (onToggleMute) {
      trackEvent(soundsPlayingAndNotMuted ? 'mix_pause' : 'mix_play', { character_id: character.id });
      onToggleMute();
    }
  }, [customization.soundIds, soundIds.length, onToggleMute, triggerSoundHint, trackEvent, soundsPlayingAndNotMuted, character.id]);

  const handleCharacterClick = () => {
    if (customization.soundIds && customization.soundIds.length > 0) {
       handleTogglePlay();
    } else {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1500);
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

  const noSoundsInLibrary = (customization.soundIds?.length ?? 0) === 0;

  return (
    <div
      className={`${styles.characterCard} ${isGreyedOut ? styles.characterCardMuted : ''} ${isMain ? styles.mainCharacter : ''}`}
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
      <div className={styles.characterHeader}>
        <Chip tone="title" font="goofy" size="lg" className={styles.characterName}>
          {displayName.toUpperCase()}'S MIX!
        </Chip>
        {character.japaneseName && (
          <span className={styles.japaneseSubtitle}>{character.japaneseName}</span>
        )}
      </div>

      <div
        className={`${styles.dropTarget} ${pulseClass} ${isDropActive ? styles.dropTargetActive : ''} ${
          isGlowBurst && soundsPlayingAndNotMuted && isFavorite ? styles.dropTargetGlow : ''
        } ${isLooping ? styles.dropTargetHasLoop : ''} ${
          size === 'large' ? styles.dropTargetLarge : styles.dropTargetNormal
        }`}
        data-character-id={character.id}
        onClick={handleCharacterClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={`${styles.backgroundLoop} ${isLooping ? styles.backgroundLoopActive : ''}`} />
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
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Muted Icon Overlay */}
        {isMuted && soundIds.length > 0 && (
          <div className={styles.mutedOverlay}>
            <Pause size={48} />
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
            {showHintTooltip && (
              <div className={styles.hintTooltip}>
                ACTIVATE!
              </div>
            )}
            {customization.soundIds.map((soundId, index) => {
              const sound = soundCatalogById.get(soundId);
              const soundName = sound?.name ?? soundId;
              const colorToken = sound?.colorToken;
              const isActive = soundIds.includes(soundId);
              const isPlaying = isActive && soundsPlayingAndNotMuted;
              const isHinting = isPlaying && hintingIds.has(soundId);

              return (
                <Chip
                  key={`${character.id}-slot-${index}`}
                  className={`${styles.characterSoundTag} ${isPlaying ? '' : styles.soundTagPaused} ${isHinting ? styles.soundTagHinting : ''}`}
                  tone="neutral"
                  size="sm"
                  style={
                    isPlaying && colorToken
                      ? {
                          background: `var(${colorToken})`,
                          color: '#fff',
                          borderColor: 'transparent',
                          boxShadow: `0 0 0.65rem var(${colorToken}), 0 0.1rem 0.5rem rgba(0, 0, 0, 0.4)`,
                        }
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
          {isMain ? (
            <>
              <div className={styles.characterActionWrap}>
                <TooltipTrigger isOpen={(noSoundsInLibrary && isFlashing) || undefined}>
                  <Button
                    type="button"
                    variant="action"
                    size="sm"
                    shape="pill"
                    className={`${styles.characterActionButton} ${noSoundsInLibrary ? styles.actionWithLabel : ''}`}
                    onPress={() => {
                      if (onOpenProfile) onOpenProfile();
                    }}
                    aria-label="View Profile"
                  >
                    <UserRoundPen size={14} />
                    {noSoundsInLibrary && <span className={styles.actionLabel}>{displayName.toUpperCase()}</span>}
                  </Button>
                  <Tooltip>{noSoundsInLibrary ? "add sounds!" : "PROFILE"}</Tooltip>
                </TooltipTrigger>
              </div>
              {customization.soundIds && customization.soundIds.length > 0 && (
                <>
                  <div className={styles.characterActionWrap}>
                    <TooltipTrigger>
                      <Button
                        type="button"
                        variant="action"
                        size="sm"
                        shape="pill"
                        className={styles.characterActionButton}
                        onPress={() => handleTogglePlay()}
                        aria-label={soundsPlayingAndNotMuted ? 'Pause Mix' : 'Play Mix'}
                      >
                        {soundsPlayingAndNotMuted ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Tooltip>{soundsPlayingAndNotMuted ? 'PAUSE' : 'PLAY'}</Tooltip>
                    </TooltipTrigger>
                  </div>
                </>
              )}
              {customization.soundIds && customization.soundIds.length > 0 && (
                <div className={styles.characterActionWrap}>
                  <TooltipTrigger>
                    <Button
                      type="button"
                      variant="action"
                      size="sm"
                      shape="pill"
                      className={styles.characterActionButton}
                      onPress={() => onShuffle?.()}
                      aria-label="Shuffle sounds"
                    >
                      <Shuffle size={14} />
                    </Button>
                    <Tooltip>SHUFFLE</Tooltip>
                  </TooltipTrigger>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.characterActionWrap}>
                <TooltipTrigger isOpen={(noSoundsInLibrary && isFlashing) || undefined}>
                  <Button
                    type="button"
                    variant="action"
                    size="sm"
                    shape="pill"
                    className={`${styles.characterActionButton} ${noSoundsInLibrary ? styles.actionWithLabel : ''}`}
                    onPress={() => {
                      if (onOpenProfile) onOpenProfile();
                    }}
                    aria-label="View Profile"
                  >
                    <UserRoundPen size={14} />
                    {noSoundsInLibrary && <span className={styles.actionLabel}>{displayName.toUpperCase()}</span>}
                  </Button>
                  <Tooltip>{noSoundsInLibrary ? "add sounds!" : "PROFILE"}</Tooltip>
                </TooltipTrigger>
              </div>
              {customization.soundIds && customization.soundIds.length > 0 && (
                <>
                  <div className={styles.characterActionWrap}>
                    <TooltipTrigger>
                      <Button
                        type="button"
                        variant="action"
                        size="sm"
                        shape="pill"
                        className={styles.characterActionButton}
                        onPress={() => handleTogglePlay()}
                        aria-label={soundsPlayingAndNotMuted ? 'Pause Mix' : 'Play Mix'}
                      >
                        {soundsPlayingAndNotMuted ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Tooltip>{soundsPlayingAndNotMuted ? 'PAUSE' : 'PLAY'}</Tooltip>
                    </TooltipTrigger>
                  </div>
                </>
              )}
              {customization.soundIds && customization.soundIds.length > 0 && (
                <div className={styles.characterActionWrap}>
                  <TooltipTrigger>
                    <Button
                      type="button"
                      variant="action"
                      size="sm"
                      shape="pill"
                      className={styles.characterActionButton}
                      onPress={() => onShuffle?.()}
                      aria-label="Shuffle sounds"
                    >
                      <Shuffle size={14} />
                    </Button>
                    <Tooltip>SHUFFLE</Tooltip>
                  </TooltipTrigger>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterCard;
