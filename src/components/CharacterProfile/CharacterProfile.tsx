import React, { useMemo, useEffect, useState, useRef, type CSSProperties } from 'react';
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
  faPlus,
  faChevronUp,
  faChevronDown,
  faHeart as faHeartSolid
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Button, Chip, Meter } from '../../components-ui';
import type { CharacterOption, SoundOption, SoundCategory } from '../../config';
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
  favoriteSoundIds: string[];
  isMain?: boolean;
  onClose: () => void;
  onToggleSound: (soundId: string, path: string) => void;
  onApply: (patch?: any) => void;
  onNavigateShop: () => void;
  onRecordCombo?: (comboId: string) => void;
  onToggleFavoriteSound: (soundId: string) => void;
};

type LibraryTab = 'favs' | 'cat' | 'mood' | 'all';

/**
 * CharacterProfile
 * Redesigned with Filterable Library, JS Scrolling and Unified Cloud
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
  favoriteSoundIds,
  isMain = false,
  onClose,
  onToggleSound,
  onApply,
  onNavigateShop,
  onRecordCombo,
  onToggleFavoriteSound,
}: CharacterProfileProps) {
  const [activeTab, setActiveTab] = useState<'sounds' | 'identity' | 'milestones'>('sounds');
  const [libTab, setLibTab] = useState<LibraryTab>('all');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [draftCustomization, setDraftCustomization] = useState(characterCustomizations[characterId] || {});
  const scrollRef = useRef<HTMLDivElement>(null);

  const characterName = draftCustomization?.name?.trim() || character.name;
  const characterImage = draftCustomization?.image || character.img;
  
  const constellationSounds = useMemo(() => {
    const ids = draftCustomization?.soundIds || character.sounds.map(s => s.id);
    return ids.map(id => soundCatalogById.get(id)).filter((s): s is SoundOption => !!s);
  }, [character.sounds, draftCustomization?.soundIds, soundCatalogById]);

  // Library Sorting/Filtering Logic
  const filteredLibrary = useMemo(() => {
    let base = [...character.sounds];
    
    if (libTab === 'favs') {
      base = base.filter(s => favoriteSoundIds.includes(s.id));
    }

    if (libTab === 'cat' && activeFilter) {
      base = base.filter(s => s.category === activeFilter);
    }

    if (libTab === 'mood' && activeFilter) {
      base = base.filter(s => s.mood === activeFilter);
    }

    // Grouping for 'all', 'favs' (or 'cat'/'mood' when no filter selected)
    if ((libTab === 'all' || libTab === 'favs') || !activeFilter) {
      const grouped: Record<string, SoundOption[]> = {};
      base.forEach(s => {
        const cat = s.category || 'other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(s);
      });
      return grouped;
    }

    return base; // Flat list for cat/mood with filter
  }, [character.sounds, libTab, activeFilter, favoriteSoundIds]);

  const filterOptions = useMemo(() => {
    if (libTab === 'cat') {
      const cats = new Set(character.sounds.map(s => s.category));
      return Array.from(cats);
    }
    if (libTab === 'mood') {
      const moods = new Set(character.sounds.map(s => s.mood).filter(Boolean));
      return Array.from(moods);
    }
    return [];
  }, [character.sounds, libTab]);

  // Sync discovered combos
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

  const scheme = character.schemes[0];
  const cssVars = {
    '--character-title': scheme.titleColor,
    '--character-primary': scheme.primaryColor,
    '--character-secondary': scheme.secondaryColor,
    '--character-soundboard': scheme.soundboardColor,
  } as CSSProperties;

  const floatingPositions = useMemo(() => {
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

  const handleScroll = (dir: 'up' | 'down') => {
    if (!scrollRef.current) return;
    const amount = window.innerHeight * 0.7;
    scrollRef.current.scrollBy({
      top: dir === 'up' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const handleUpdateDraft = (patch: any) => {
    setDraftCustomization(prev => ({ ...prev, ...patch }));
  };

  const handleApply = () => {
    onApply(draftCustomization);
  };

  const renderLibraryItem = (sound: SoundOption) => {
    const isSelected = constellationSounds.some(s => s.id === sound.id);
    const isFav = favoriteSoundIds.includes(sound.id);
    return (
      <div key={sound.id} className={styles.libraryItemRow}>
        <button 
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
        <button 
          className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`}
          onClick={() => onToggleFavoriteSound(sound.id)}
        >
          <FontAwesomeIcon icon={isFav ? faHeartSolid : faHeartRegular} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.profilePage} style={cssVars}>
      {/* Sidebar Library */}
      <aside className={`${styles.librarySidebar} ${isLibraryOpen ? styles.libraryOpen : ''}`}>
        <header className={styles.libraryHeader}>
          <div className={styles.libTabs}>
            <button className={`${styles.libTab} ${libTab === 'favs' ? styles.libTabActive : ''}`} onClick={() => { setLibTab('favs'); setActiveFilter(null); }}>FAVS</button>
            <button className={`${styles.libTab} ${libTab === 'cat' ? styles.libTabActive : ''}`} onClick={() => { setLibTab('cat'); setActiveFilter(null); }}>CAT</button>
            <button className={`${styles.libTab} ${libTab === 'mood' ? styles.libTabActive : ''}`} onClick={() => { setLibTab('mood'); setActiveFilter(null); }}>MOOD</button>
            <button className={`${styles.libTab} ${libTab === 'all' ? styles.libTabActive : ''}`} onClick={() => { setLibTab('all'); setActiveFilter(null); }}>ALL</button>
          </div>
          <button className={styles.libraryToggle} onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
            <FontAwesomeIcon icon={isLibraryOpen ? faChevronLeft : faChevronRight} />
          </button>
        </header>

        <div className={styles.libraryScrollWrap}>
          <button className={styles.scrollArrow} onClick={() => handleScroll('up')}><FontAwesomeIcon icon={faChevronUp} /></button>
          <div className={styles.libraryList} ref={scrollRef}>
            {Array.isArray(filteredLibrary) ? (
              filteredLibrary.map(renderLibraryItem)
            ) : (
              Object.entries(filteredLibrary).map(([cat, sounds]) => (
                <div key={cat} className={styles.libGroup}>
                  <div className={styles.libGroupHeader}>{cat.toUpperCase()}</div>
                  <div className={styles.libGroupContent}>
                    {sounds.map(renderLibraryItem)}
                  </div>
                </div>
              ))
            )}
          </div>
          <button className={styles.scrollArrow} onClick={() => handleScroll('down')}><FontAwesomeIcon icon={faChevronDown} /></button>
        </div>

        {(libTab === 'cat' || libTab === 'mood') && (
          <div className={styles.filterBar}>
            {filterOptions.map(opt => (
              <button 
                key={opt} 
                className={`${styles.filterChip} ${activeFilter === opt ? styles.filterChipActive : ''}`}
                onClick={() => setActiveFilter(activeFilter === opt ? null : opt)}
              >
                {opt?.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className={styles.libraryFooter}>
           <Button variant="secondary" size="sm" onPress={onNavigateShop}>GET MORE</Button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button variant="quiet" size="sm" className={styles.backButton} onPress={onClose}>
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
          <button className={`${styles.tabLink} ${activeTab === 'sounds' ? styles.tabLinkActive : ''}`} onClick={() => setActiveTab('sounds')}>
            <FontAwesomeIcon icon={faMusic} />
            <span>CONSTELLATION</span>
          </button>
          {!isMain && (
            <button className={`${styles.tabLink} ${activeTab === 'identity' ? styles.tabLinkActive : ''}`} onClick={() => setActiveTab('identity')}>
              <FontAwesomeIcon icon={faUser} />
              <span>IDENTITY</span>
            </button>
          )}
          <button className={`${styles.tabLink} ${activeTab === 'milestones' ? styles.tabLinkActive : ''}`} onClick={() => setActiveTab('milestones')}>
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
                      <div key={combo.id} className={`${styles.comboCard} ${!isDiscovered ? styles.isLocked : styles.isDiscovered} ${isCurrentlyActive ? styles.isCurrentlyActive : ''}`}>
                        <span className={`${styles.comboRarity} ${styles[combo.rarity]}`}>{combo.rarity}</span>
                        <h3 className={styles.comboName}>
                          {isDiscovered ? combo.name : '???'}
                          {!isDiscovered && <FontAwesomeIcon icon={faLock} style={{ marginLeft: 8, fontSize: '0.8em', opacity: 0.5 }} />}
                        </h3>
                        <p className={styles.comboDescription}>{isDiscovered ? combo.description : 'Combine secret sounds to reveal.'}</p>
                        {isCurrentlyActive && <div className={styles.activeIndicator}>ACTIVE IN MIX</div>}
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
                    const isUnlocked = [ACHIEVEMENTS[0].id].includes(achievement.id);
                    return (
                      <div key={achievement.id} className={`${styles.achievementItem} ${!isUnlocked ? styles.isLocked : ''}`}>
                        <div className={styles.achievementIcon}><FontAwesomeIcon icon={faTrophy} /></div>
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
            <Meter aria-label="Mix capacity" value={(activeSounds.length / soundsPerCharacter) * 100} className={styles.profileMeter} />
          </div>
          <div className={styles.footerRight}>
            <Button variant="primary" size="lg" className={styles.applyButton} onPress={handleApply}>APPLY CHANGES</Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
