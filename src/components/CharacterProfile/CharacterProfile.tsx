import React, { useMemo, useEffect, type CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrophy, faStar, faXmark, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button, Chip, Meter } from '../../components-ui';
import type { CharacterOption, SoundOption } from '../../config';
import { COMBOS, ACHIEVEMENTS } from '../../config';
import styles from './CharacterProfile.module.sass';

export type CharacterProfileProps = {
  characterId: string;
  characters: CharacterOption[];
  characterCustomizations: Record<string, { name?: string; image?: string; soundIds?: string[] }>;
  activeSounds: string[];
  unlockedLevel: number;
  soundsPerCharacter: number;
  soundCatalogById: Map<string, SoundOption>;
  discoveredComboIds: string[];
  onClose: () => void;
  onToggleSound: (soundId: string, path: string) => void;
  onApply: () => void;
  onNavigateShop: () => void;
  onRecordCombo?: (comboId: string) => void;
};

/**
 * CharacterProfile
 * Evolved sound picker and character identity space.
 */
export function CharacterProfile({
  characterId,
  characters,
  characterCustomizations,
  activeSounds,
  unlockedLevel,
  soundsPerCharacter,
  soundCatalogById,
  discoveredComboIds,
  onClose,
  onToggleSound,
  onApply,
  onNavigateShop,
  onRecordCombo,
}: CharacterProfileProps) {
  const character = characters.find((c) => c.id === characterId);
  if (!character) return null;

  const customization = characterCustomizations[characterId];
  const characterName = customization?.name?.trim() || character.name;
  const characterImage = customization?.image || character.img;
  
  // Available sounds for this character's constellation
  const constellationSounds = useMemo(() => {
    // If customized sounds exist, use them, otherwise use character defaults
    const ids = customization?.soundIds || character.sounds.map(s => s.id).slice(0, 16);
    return ids.map(id => soundCatalogById.get(id)).filter((s): s is SoundOption => !!s);
  }, [character.sounds, customization?.soundIds, soundCatalogById]);

  // Check discovered combos based on active sounds
  const activeSet = useMemo(() => new Set(activeSounds), [activeSounds]);
  
  // Record new combos discovered while interacting in this view
  useEffect(() => {
    COMBOS.forEach(combo => {
      if (combo.soundIds.every(id => activeSet.has(id))) {
        if (!discoveredComboIds.includes(combo.id)) {
          onRecordCombo?.(combo.id);
        }
      }
    });
  }, [activeSet, discoveredComboIds, onRecordCombo]);

  // Mock unlocked achievements for now - in real app would come from progressionState
  const unlockedAchievements = useMemo(() => {
    return [ACHIEVEMENTS[0].id];
  }, []);

  const scheme = character.schemes[0]; // Using first scheme for now

  const cssVars = {
    '--character-title': scheme.titleColor,
    '--character-primary': scheme.primaryColor,
    '--character-secondary': scheme.secondaryColor,
    '--character-soundboard': scheme.soundboardColor,
  } as CSSProperties;

  // Generate deterministic random positions for the constellation
  const floatingPositions = useMemo(() => {
    return constellationSounds.map((_, i) => {
      const angle = (i / constellationSounds.length) * Math.PI * 2;
      const radius = 100 + (Math.sin(i * 123.45) * 50);
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.8),
        scale: 0.8 + (Math.sin(i * 678.9) * 0.3),
        delay: Math.sin(i * 456.7) * 2,
      };
    });
  }, [constellationSounds.length]);

  return (
    <div className={styles.profilePage} style={cssVars}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button 
            variant="quiet" 
            size="sm" 
            className={styles.backButton} 
            onPress={onClose}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
            <span>BACK TO GRID</span>
          </Button>
          <h1 className={styles.characterName}>{characterName}</h1>
          <span className={styles.characterLevel}>LEVEL {unlockedLevel + 1} SOUNDMIXER</span>
        </div>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
      </header>

      <div className={styles.profileContent}>
        {/* The Constellation */}
        <section className={styles.constellationSection}>
          <div className={styles.constellationHeader}>
            <h2 className={styles.constellationTitle}>THE CONSTELLATION</h2>
            <p className={styles.constellationDesc}>Select up to {soundsPerCharacter} sounds for your mix.</p>
          </div>
          
          <div className={styles.constellationStage}>
            <img src={characterImage} alt="" className={styles.characterBg} />
            <div className={styles.floatingWrap}>
              {constellationSounds.map((sound, i) => {
                const isActive = activeSounds.includes(sound.id);
                const pos = floatingPositions[i];
                return (
                  <div 
                    key={sound.id}
                    className={styles.floatingChip}
                    style={{
                      '--tx': `${pos.x}px`,
                      '--ty': `${pos.y}px`,
                      '--scale': pos.scale,
                      '--delay': `${pos.delay}s`,
                    } as CSSProperties}
                  >
                    <Chip
                      tone={isActive ? 'title' : 'neutral'}
                      size="md"
                      className={`${styles.constellationChip} ${isActive ? styles.isActive : ''}`}
                      onClick={() => onToggleSound(sound.id, sound.path)}
                      style={
                        isActive
                          ? ({ '--sound-color': `var(${sound.colorToken})`, background: `var(${sound.colorToken})`, color: '#000', borderColor: 'transparent' } as CSSProperties)
                          : {}
                      }
                    >
                      {sound.name.toUpperCase()}
                    </Chip>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Combo Discovery */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faStar} style={{ marginRight: 8 }} />
              Combo Discovery
            </h2>
            <span className={styles.sectionCount}>{discoveredComboIds.length} / {COMBOS.length}</span>
          </div>
          <div className={styles.comboGrid}>
            {COMBOS.map((combo) => {
              const isDiscovered = discoveredComboIds.includes(combo.id);
              const isCurrentlyActive = combo.soundIds.every(id => activeSet.has(id));
              
              return (
                <div 
                  key={combo.id} 
                  className={`
                    ${styles.comboCard} 
                    ${!isDiscovered ? styles.isLocked : styles.isDiscovered}
                    ${isCurrentlyActive ? styles.isCurrentlyActive : ''}
                  `}
                >
                  <span className={`${styles.comboRarity} ${styles[combo.rarity]}`}>
                    {combo.rarity}
                  </span>
                  <h3 className={styles.comboName}>
                    {isDiscovered ? combo.name : '???'}
                    {!isDiscovered && <FontAwesomeIcon icon={faLock} style={{ marginLeft: 8, fontSize: '0.8em', opacity: 0.5 }} />}
                  </h3>
                  <p className={styles.comboDescription}>
                    {isDiscovered ? combo.description : 'Combine secret sounds to reveal.'}
                  </p>
                  {isCurrentlyActive && (
                    <div className={styles.activeIndicator}>ACTIVE IN MIX</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faTrophy} style={{ marginRight: 8 }} />
              Milestones
            </h2>
          </div>
          <div className={styles.achievementList}>
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div 
                  key={achievement.id} 
                  className={`${styles.achievementItem} ${!isUnlocked ? styles.isLocked : ''}`}
                >
                  <div className={styles.achievementIcon}>
                    <FontAwesomeIcon icon={faTrophy} />
                  </div>
                  <div className={styles.achievementText}>
                    <span className={styles.achievementTitle}>{achievement.title}</span>
                    <span className={styles.achievementDesc}>{achievement.description}</span>
                  </div>
                  {isUnlocked && <div className={styles.unlockedBadge}>UNLOCKED</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className={styles.footerActions}>
        <div className={styles.footerLeft}>
          <div className={styles.capacityHeader}>
            <span className={styles.capacityLabel}>MIX CAPACITY</span>
            <span className={styles.capacityValue}>{activeSounds.length} / {soundsPerCharacter}</span>
          </div>
          <Meter
            aria-label="Mix capacity"
            value={(activeSounds.length / soundsPerCharacter) * 100}
            className={styles.profileMeter}
          />
        </div>
        <div className={styles.footerRight}>
          <Button variant="secondary" size="lg" onPress={onNavigateShop}>
            SHOP
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            className={styles.applyButton}
            onPress={onApply}
          >
            APPLY TO {characterName.toUpperCase()}
          </Button>
        </div>
      </footer>
    </div>
  );
}
