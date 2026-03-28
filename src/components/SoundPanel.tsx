import type { DragEvent } from 'react';
import styles from './SoundPanel.module.sass';
import type { SoundOption } from '../config';

type SoundPanelProps = {
  activeCharacterName: string;
  activeSoundIds: string[];
  totalActiveSounds: number;
  maxSoundsTotal: number;
  soundCatalogById: Map<string, SoundOption>;
  visibleSounds: SoundOption[];
  isUltraReady: boolean;
  isUltraMode: boolean;
  ultraLabel: string;
  glowPercent: number;
  isCheerVisible: boolean;
  isCheerActive: boolean;
  onActivateUltra: () => void;
  onPlayCheer: () => void;
  onDisableSound: (soundId: string) => void;
  onToggleSound: (soundId: string) => void;
  onDragStart: (event: DragEvent<HTMLButtonElement>, soundId: string) => void;
  onTouchStart: (soundId: string) => void;
};

function SoundPanel({
  activeCharacterName,
  activeSoundIds,
  totalActiveSounds,
  maxSoundsTotal,
  soundCatalogById,
  visibleSounds,
  isUltraReady,
  isUltraMode,
  ultraLabel,
  glowPercent,
  isCheerVisible,
  isCheerActive,
  onActivateUltra,
  onPlayCheer,
  onDisableSound,
  onToggleSound,
  onDragStart,
  onTouchStart,
}: SoundPanelProps) {
  return (
    <>
      <div className={styles.gameRow}>
        <div
          className={`${styles.glowMeter} ${isUltraReady ? styles.glowMeterReady : ''}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={glowPercent}
          aria-label="Sync meter"
        >
          <div className={styles.glowMeterFill} style={{ width: `${glowPercent}%` }} />
          <span className={styles.glowMeterLabel}>
            SYNC {totalActiveSounds}/{maxSoundsTotal}
          </span>
        </div>
        <button
          type="button"
          className={`${styles.ultraButton} ${isUltraReady ? styles.ultraButtonReady : ''} ${
            isUltraMode ? styles.ultraButtonActive : ''
          }`}
          onClick={onActivateUltra}
          disabled={!isUltraReady || isUltraMode}
          aria-pressed={isUltraMode}
        >
          {ultraLabel}
        </button>
        {isCheerVisible && (
          <button
            type="button"
            className={`${styles.cheerButton} ${isCheerActive ? styles.cheerButtonActive : ''}`}
            onClick={onPlayCheer}
            disabled={isCheerActive}
            aria-label="Trigger audience cheer"
          >
            👏
          </button>
        )}
      </div>

      <p className={styles.activeSummary}>
        {activeSoundIds.length === 0
          ? 'No active sounds'
          : `${activeSoundIds.length} active sound${activeSoundIds.length > 1 ? 's' : ''}`}
      </p>
      <div className={styles.activeTags}>
        {activeSoundIds.map((soundId) => (
          <button
            key={soundId}
            type="button"
            className={styles.activeTagButton}
            onClick={() => onDisableSound(soundId)}
            aria-label={`Disable ${soundCatalogById.get(soundId)?.name ?? soundId}`}
          >
            {soundCatalogById.get(soundId)?.name ?? soundId}
          </button>
        ))}
      </div>

      <details className={styles.soundDropdown} open>
        <summary>{activeCharacterName.toUpperCase()}'S SOUNDBOARD</summary>
        <p className={styles.dropdownHelper}>Tap to toggle. Each character can hold up to 3 sounds (12 total).</p>
        <div className={styles.soundGrid}>
          {visibleSounds.map((sound) => {
            const isActive = activeSoundIds.includes(sound.id);

            return (
              <button
                key={sound.id}
                type="button"
                className={`${styles.soundChip} ${isActive ? styles.soundChipActive : ''} ${
                  isUltraMode ? styles.soundChipUltra : ''
                }`}
                draggable
                onDragStart={(event) => onDragStart(event, sound.id)}
                onTouchStart={() => onTouchStart(sound.id)}
                onClick={() => onToggleSound(sound.id)}
                style={{
                  backgroundColor: isActive ? `var(${sound.colorToken})` : `var(${sound.colorToken}-opq)`,
                }}
              >
                {sound.name}
              </button>
            );
          })}
        </div>
      </details>
    </>
  );
}

export default SoundPanel;
