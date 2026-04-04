import React, { useMemo, type CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrophy, faStar, faXmark } from '@fortawesome/free-solid-svg-icons';
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
  onClose: () => void;
  onToggleSound: (soundId: string, path: string) => void;
  onApply: () => void;
  onNavigateShop: () => void;
};

export function CharacterProfile({
  characterId,
  characters,
  characterCustomizations,
  activeSounds,
  unlockedLevel,
  soundsPerCharacter,
  soundCatalogById,
  onClose,
  onToggleSound,
  onApply,
  onNavigateShop,
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
  const discoveredCombos = useMemo(() => {
    const activeSet = new Set(activeSounds);
    return COMBOS.filter(combo => combo.soundIds.every(id => activeSet.has(id)));
  }, [activeSounds]);

  // Mock unlocked achievements for now
  const unlockedAchievements = useMemo(() => {
    // This would normally come from persistence
    return [ACHIEVEMENTS[0].id];
  }, []);

  const scheme = character.schemes[0]; // Using first scheme for now

  const cssVars = {
    '--character-title': scheme.titleColor,
    '--character-primary': scheme.primaryColor,
    '--character-secondary': scheme.secondaryColor,
    '--character-soundboard': scheme.soundboardColor,
  } as CSSProperties;

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
          <img src={characterImage} alt="" className={styles.characterBg} />
          <div className={styles.soundChipsWrap}>
            {constellationSounds.map((sound) => {
              const isActive = activeSounds.includes(sound.id);
              return (
                <Chip
                  key={sound.id}
                  tone={isActive ? 'title' : 'neutral'}
                  size="md"
                  className={`${styles.constellationChip} ${isActive ? styles.isActive : ''}`}
                  onPress={() => onToggleSound(sound.id, sound.path)}
                  style={
                    isActive
                      ? ({ '--sound-color': `var(${sound.colorToken})`, background: `var(${sound.colorToken})`, color: '#000', borderColor: 'transparent' } as CSSProperties)
                      : {}
                  }
                >
                  {sound.name.toUpperCase()}
                </Chip>
              );
            })}
          </div>
        </section>

        {/* Combo Discovery */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faStar} style={{ marginRight: 8 }} />
              Combo Discovery
            </h2>
            <span className={styles.sectionCount}>{discoveredCombos.length} / {COMBOS.length}</span>
          </div>
          <div className={styles.comboGrid}>
            {COMBOS.map((combo) => {
              const isDiscovered = discoveredCombos.some(c => c.id === combo.id);
              return (
                <div 
                  key={combo.id} 
                  className={`${styles.comboCard} ${!isDiscovered ? styles.isLocked : styles.isDiscovered}`}
                >
                  <span className={`${styles.comboRarity} ${styles[combo.rarity]}`}>
                    {combo.rarity}
                  </span>
                  <h3 className={styles.comboName}>{isDiscovered ? combo.name : '???'}</h3>
                  <p className={styles.comboDescription}>
                    {isDiscovered ? combo.description : 'Keep mixing to discover this combo.'}
                  </p>
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
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className={styles.footerActions}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Button 
            variant="primary" 
            size="lg" 
            className={styles.applyButton}
            onPress={onApply}
          >
            APPLY TO {characterName.toUpperCase()}
          </Button>
          <div className={styles.capacityMeter}>
            <Meter
              label="MIX CAPACITY"
              value={(activeSounds.length / soundsPerCharacter) * 100}
              valueLabel={`${activeSounds.length} / ${soundsPerCharacter}`}
            />
          </div>
        </div>
        <Button variant="secondary" size="lg" onPress={onNavigateShop}>
          SHOP
        </Button>
      </footer>
    </div>
  );
}
