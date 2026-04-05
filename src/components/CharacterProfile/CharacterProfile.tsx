import React, { useMemo, useEffect, useState, type CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTrophy, 
  faStar, 
  faXmark, 
  faLock, 
  faUser, 
  faMusic,
  faChevronRight,
  faChevronLeft,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Button, Chip, Meter } from '../../components-ui';
import type { CharacterOption, SoundOption } from '../../config';
import { COMBOS, ACHIEVEMENTS } from '../../config';
import styles from './CharacterProfile.module.sass';

export type CharacterColorOption = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type CharacterImageOption = {
  readonly id: string;
  readonly label: string;
  readonly src: string;
};

export type CharacterProfileProps = {
  characterId: string;
  character: CharacterOption;
  characters: CharacterOption[];
  characterCustomizations: Record<string, { name?: string; image?: string; soundIds?: string[]; colorModes?: string[] }>;
  activeSounds: string[];
  unlockedLevel: number;
  soundsPerCharacter: number;
  soundCatalogById: Map<string, SoundOption>;
  discoveredComboIds: string[];
  colorOptions: readonly CharacterColorOption[];
  imageOptions: readonly CharacterImageOption[];
  isMain?: boolean;
  onClose: () => void;
  onToggleSound: (soundId: string, path: string) => void;
  onApply: (patch?: any) => void;
  onNavigateShop: () => void;
  onRecordCombo?: (comboId: string) => void;
};

const AUTO_SWATCH_STYLE = {
  background: 'conic-gradient(from 120deg, #ffffff, #ff2ad4, #00f5ff, #ffe600, #ffffff)',
};

/**
 * CharacterProfile
 * Redesigned with Library Sidebar and Unified Constellation
 */
export function CharacterProfile({
  characterId,
  character,
  characterCustomizations,
  activeSounds,
  unlockedLevel,
  soundsPerCharacter,
  soundCatalogById,
  discoveredComboIds,
  colorOptions,
  imageOptions,
  isMain = false,
  onClose,
  onToggleSound,
  onApply,
  onNavigateShop,
  onRecordCombo,
}: CharacterProfileProps) {
  const [activeTab, setActiveTab] = useState<'sounds' | 'identity' | 'milestones'>('sounds');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [draftCustomization, setDraftCustomization] = useState(characterCustomizations[characterId] || {});

  const characterName = draftCustomization?.name?.trim() || character.name;
  const characterImage = draftCustomization?.image || character.img;
  
  // Available sounds for this character's constellation
  const constellationSounds = useMemo(() => {
    const ids = draftCustomization?.soundIds || character.sounds.map(s => s.id);
    return ids.map(id => soundCatalogById.get(id)).filter((s): s is SoundOption => !!s);
  }, [character.sounds, draftCustomization?.soundIds, soundCatalogById]);

  // Library sounds (all owned/available for this character)
  const librarySounds = useMemo(() => {
    return character.sounds;
  }, [character.sounds]);

  // Check discovered combos based on active sounds
  const activeSet = useMemo(() => new Set(activeSounds), [activeSounds]);
  
  useEffect(() => {
    COMBOS.forEach(combo => {
      if (combo.soundIds.every(id => activeSet.has(id))) {
        if (!discoveredComboIds.includes(combo.id)) {
          onRecordCombo?.(combo.id);
        }
      }
    });
  }, [activeSet, discoveredComboIds, onRecordCombo]);

  const unlockedAchievements = useMemo(() => {
    return [ACHIEVEMENTS[0].id];
  }, []);

  const scheme = character.schemes[0];

  const cssVars = {
    '--character-title': scheme.titleColor,
    '--character-primary': scheme.primaryColor,
    '--character-secondary': scheme.secondaryColor,
    '--character-soundboard': scheme.soundboardColor,
  } as CSSProperties;

  // Unified floating positions - same for all characters
  const floatingPositions = useMemo(() => {
    // Generate a fixed grid/cloud of 16 positions
    const positions = [];
    const count = 16; 
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 110 + (Math.sin(i * 1.5) * 40);
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.75),
        scale: 0.9 + (Math.sin(i * 2.2) * 0.2),
        delay: Math.sin(i * 0.8) * 2,
      });
    }
    return positions;
  }, []);

  const handleUpdateDraft = (patch: any) => {
    setDraftCustomization(prev => ({ ...prev, ...patch }));
  };

  const handleToggleColor = (colorValue: string) => {
    const currentColors = draftCustomization.colorModes ?? [];
    const maxColors = unlockedLevel >= 1 ? 3 : 1;

    if (colorValue === 'auto') {
      handleUpdateDraft({ colorModes: ['auto'] });
      return;
    }

    const filteredColors = currentColors.filter((c) => c !== 'auto');

    if (filteredColors.includes(colorValue)) {
      const nextColors = filteredColors.filter((c) => c !== colorValue);
      handleUpdateDraft({ colorModes: nextColors.length > 0 ? nextColors : ['auto'] });
    } else {
      handleUpdateDraft({
        colorModes: [...filteredColors, colorValue].slice(-maxColors),
      });
    }
  };

  const handleApply = () => {
    onApply(draftCustomization);
  };

  return (
    <div className={styles.profilePage} style={cssVars}>
      {/* Sidebar Library */}
      <aside className={`${styles.librarySidebar} ${isLibraryOpen ? styles.libraryOpen : ''}`}>
        <header className={styles.libraryHeader}>
          <h6>SOUND LIBRARY</h6>
          <button className={styles.libraryToggle} onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
            <FontAwesomeIcon icon={isLibraryOpen ? faChevronLeft : faChevronRight} />
          </button>
        </header>
        <div className={styles.libraryList}>
          {librarySounds.map(sound => {
            const isSelected = constellationSounds.some(s => s.id === sound.id);
            return (
              <button 
                key={sound.id} 
                className={`${styles.libraryItem} ${isSelected ? styles.libraryItemActive : ''}`}
                onClick={() => {
                   const currentIds = draftCustomization.soundIds || character.sounds.map(s => s.id);
                   if (isSelected) {
                     handleUpdateDraft({ soundIds: currentIds.filter(id => id !== sound.id) });
                   } else {
                     handleUpdateDraft({ soundIds: [...currentIds, sound.id] });
                   }
                }}
              >
                <div className={styles.libraryItemDot} style={{ background: `var(${sound.colorToken})` }} />
                <span className={styles.libraryItemName}>{sound.name.toUpperCase()}</span>
                <FontAwesomeIcon icon={faPlus} className={styles.libraryItemPlus} />
              </button>
            );
          })}
        </div>
        <div className={styles.libraryFooter}>
           <Button variant="secondary" size="sm" onPress={onNavigateShop}>GET MORE</Button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button 
              variant="quiet" 
              size="sm" 
              className={styles.backButton} 
              onPress={onClose}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
              <span>BACK TO STAGE</span>
            </Button>
            <h1 className={styles.characterName}>{characterName}</h1>
            <span className={styles.characterLevel}>{isMain ? 'YOUR IDENTITY' : "FRIEND'S PROFILE"} • LEVEL {unlockedLevel + 1}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </header>

        <div className={styles.profileTabs}>
          <button 
            className={`${styles.tabLink} ${activeTab === 'sounds' ? styles.tabLinkActive : ''}`}
            onClick={() => setActiveTab('sounds')}
          >
            <FontAwesomeIcon icon={faMusic} />
            <span>CONSTELLATION</span>
          </button>
          {!isMain && (
            <button 
              className={`${styles.tabLink} ${activeTab === 'identity' ? styles.tabLinkActive : ''}`}
              onClick={() => setActiveTab('identity')}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>IDENTITY</span>
            </button>
          )}
          <button 
            className={`${styles.tabLink} ${activeTab === 'milestones' ? styles.tabLinkActive : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            <FontAwesomeIcon icon={faStar} />
            <span>MILESTONES</span>
          </button>
        </div>

        <div className={styles.profileContentArea}>
          {activeTab === 'sounds' && (
            <section className={styles.constellationSection}>
              <div className={styles.constellationHeader}>
                <h2 className={styles.constellationTitle}>THE CONSTELLATION</h2>
                <p className={styles.constellationDesc}>Select sounds from library to populate your cloud.</p>
              </div>
              
              <div className={styles.constellationStage}>
                <img src={characterImage} alt="" className={styles.characterBg} />
                <div className={styles.floatingWrap}>
                  {constellationSounds.slice(0, 16).map((sound, i) => {
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
          )}

          {activeTab === 'identity' && (
            <section className={styles.identitySection}>
               <div className={styles.identityLayout}>
                  <div className={styles.identityPreview}>
                     <img src={characterImage} alt="" className={styles.identityImageLarge} />
                  </div>
                  <div className={styles.identityControls}>
                     <div className={styles.field}>
                        <span className={styles.fieldLabel}>NAME</span>
                        <input 
                          type="text" 
                          className={styles.textInput}
                          value={draftCustomization.name || ''} 
                          placeholder={character.name}
                          onChange={(e) => handleUpdateDraft({ name: e.target.value })}
                        />
                     </div>

                     <div className={styles.field}>
                        <span className={styles.fieldLabel}>APPEARANCE</span>
                        <div className={styles.imageGrid}>
                          {imageOptions.map((opt) => {
                            const isSelected = characterImage === opt.src;
                            return (
                              <button
                                key={opt.id}
                                className={`${styles.imageOption} ${isSelected ? styles.imageOptionActive : ''}`}
                                onClick={() => handleUpdateDraft({ image: opt.src })}
                              >
                                <img src={opt.src} alt={opt.label} />
                              </button>
                            );
                          })}
                        </div>
                     </div>
                  </div>
               </div>
            </section>
          )}

          {activeTab === 'milestones' && (
            <div className={styles.milestonesArea}>
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
          )}
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
            <Button 
              variant="primary" 
              size="lg" 
              className={styles.applyButton}
              onPress={handleApply}
            >
              APPLY CHANGES
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
