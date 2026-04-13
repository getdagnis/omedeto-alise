import React, { useMemo, useEffect, useState, useRef, type CSSProperties, useCallback } from 'react';
import { 
  Trophy,
  Star,
  X,
  Lock,
  UserRoundPen,
  Music,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Heart as HeartSolid,
  Sparkles,
  AudioLines,
  Circle,
  Square,
  SquareCheckBig
} from 'lucide-react';
import { Button, Chip, Notice } from '../../components-ui';
import { FloatingTextContainer } from '../../components-ui/FloatingText';
import { useFloatingText } from '../../hooks/useFloatingText';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { CharacterOption, SoundOption, CharacterCustomization } from '../../config';
import { COMBOS, ACHIEVEMENTS, AVAILABLE_PERFORMERS } from '../../config';

import styles from './CharacterProfile.module.sass';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';

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
  characterCustomizations: Record<string, CharacterCustomization>;
  activeSounds: string[];
  unlockedLevel: number;
  soundCatalogById: Map<string, SoundOption>;
  discoveredComboIds: string[];
  favoriteSoundIds: string[];
  characterLevels: Record<string, number>;
  claimedIdentityIds: string[];
  isMain?: boolean;
  onClose: () => void;
  onToggleSound: (soundId: string, path: string) => void;
  onSetSounds?: (soundIds: string[]) => void;
  onPreviewSound: (soundId: string, path: string) => void;
  onApply: (patch?: CharacterCustomization) => void;
  onNavigateShop: () => void;
  onRecordCombo?: (comboId: string) => void;
  onToggleFavoriteSound: (soundId: string) => void;
  onUpgradeCharacter?: (characterId: string, level: number) => void;
};

type LibraryTab = 'favs' | 'cat' | 'mood' | 'chars';

/**
 * CharacterProfile
 * Refined layout with fixed/centered panels and compact header.
 */
export function CharacterProfile({
  characterId,
  character,
  characterCustomizations,
  activeSounds,
  unlockedLevel,
  soundCatalogById,
  discoveredComboIds,
  favoriteSoundIds,
  characterLevels,
  claimedIdentityIds,
  isMain = false,
  onClose,
  onToggleSound,
  onSetSounds,
  onPreviewSound,
  onApply,
  onNavigateShop,
  onRecordCombo,
  onToggleFavoriteSound,
  onUpgradeCharacter,
}: CharacterProfileProps) {
  const [activeTab, setActiveTab] = useState<'sounds' | 'identity' | 'milestones'>('sounds');
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('nav_open_profile', { character_id: characterId });
  }, [characterId, trackEvent]);

  const [libTab, setLibTab] = useState<LibraryTab>('cat');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 820 : true,
  );
  const [isComboSidebarOpen, setIsComboSidebarOpen] = useState(false);
  const [sessionAddedSounds, setSessionAddedSounds] = useState<string[]>([]);
  const { items: floatingItems, addText: addFloatingText } = useFloatingText();
  const floatingTextIndexRef = useRef(0);
  const [draftCustomization, setDraftCustomization] = useState(characterCustomizations[characterId] || {});
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [hoveredComboId, setHoveredComboId] = useState<string | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isBottomReached, setIsBottomReached] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(['voice', 'beats', 'drums', 'animals', 'melody', 'creepy', 'calm', 'other', 'alise', 'gumi', 'hanako']),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const characterName = draftCustomization?.name?.trim() || character.name;
  const characterImage = draftCustomization?.image || character.img;

  const PREDEFINED_IDS = ['alise', 'gumi', 'hanako', 'foxy', 'kagamine', 'honekoneko'];
  const isPredefined = PREDEFINED_IDS.includes(characterId);

  const isCharacterSelected = useMemo(() => {
    const currentIdentId =
      draftCustomization.identityId !== undefined ? draftCustomization.identityId : character.identityId;
    const hasIdentity = !!currentIdentId;
    const hasCustomName = !!draftCustomization.name?.trim();
    const hasCustomImage = !!draftCustomization.image;

    return hasIdentity || (hasCustomName && hasCustomImage);
  }, [character.identityId, draftCustomization.identityId, draftCustomization.name, draftCustomization.image]);

  useEffect(() => {
    if (activeTab === 'identity' && !isPredefined && !draftCustomization.name) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [activeTab, isPredefined, draftCustomization.name]);

  useEffect(() => {
    if (activeTab === 'sounds' && !isCharacterSelected) {
      const timer = setTimeout(() => setIsNoticeOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isCharacterSelected]);

  const handleTabChange = useCallback(
    (tab: 'sounds' | 'identity' | 'milestones') => {
      if (tab === 'sounds' && !isCharacterSelected) {
        setIsNoticeOpen(true);
      }
      trackEvent('section_switch', { category: tab, character_id: characterId });
      setActiveTab(tab);
    },
    [isCharacterSelected, trackEvent, characterId],
  );

  const constellationSounds = useMemo(() => {
    const ids = draftCustomization?.cloudSoundIds || character.sounds.map(s => s.id).slice(0, 24);
    return ids.map(id => soundCatalogById.get(id)).filter((s): s is SoundOption => !!s);
  }, [character.sounds, draftCustomization.cloudSoundIds, soundCatalogById]);

  const cloudCompletedComboIds = useMemo(() => {
    const cloudSet = new Set(constellationSounds.map(s => s.id));
    return COMBOS.filter(c => c.soundIds.every(id => cloudSet.has(id))).map(c => c.id);
  }, [constellationSounds]);

  const soundToComboMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    COMBOS.forEach(c => {
      if (cloudCompletedComboIds.includes(c.id)) {
        c.soundIds.forEach(id => {
          if (!map[id]) map[id] = [];
          map[id].push(c.id);
        });
      }
    });
    return map;
  }, [cloudCompletedComboIds]);

  const stageActiveSet = useMemo(() => new Set(activeSounds), [activeSounds]);

  const focusedSoundIds = useMemo(() => {
    if (!hoveredComboId) return null;
    const combo = COMBOS.find(c => c.id === hoveredComboId);
    return combo ? new Set(combo.soundIds) : null;
  }, [hoveredComboId]);

  useEffect(() => {
    COMBOS.forEach(combo => {
      if (combo.soundIds.every(id => stageActiveSet.has(id))) {
        if (!discoveredComboIds.includes(combo.id)) {
          onRecordCombo?.(combo.id);
        }
      }
    });
  }, [stageActiveSet, discoveredComboIds, onRecordCombo]);

  const scheme = character.schemes[0];
  const cssVars = {
    '--character-title': scheme.titleColor,
    '--character-primary': scheme.primaryColor,
    '--character-secondary': scheme.secondaryColor,
    '--character-soundboard': scheme.soundboardColor,
  } as CSSProperties;

  const floatingPositions = useMemo(() => {
    const positions = [];
    const count = 24; 
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 135 + (Math.sin(i * 1.5) * 65);
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.72),
        scale: 0.85 + (Math.sin(i * 2.2) * 0.2),
        delay: Math.sin(i * 0.8) * 2,
      });
    }
    return positions;
  }, []);

  const handleScroll = (dir: 'up' | 'down') => {
    if (!scrollRef.current) return;
    const amount = window.innerHeight * 0.7;
    scrollRef.current.scrollBy({ top: dir === 'up' ? -amount : amount, behavior: 'smooth' });
  };

  const handleScrollJump = (dir: 'top' | 'bottom') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: dir === 'top' ? 0 : scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const onListScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollTop(scrollTop);
      setIsBottomReached(scrollTop + clientHeight >= scrollHeight - 5);
    }
  }, []);

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const handleUpdateDraft = (patch: CharacterCustomization) => {
    trackEvent('character_customized', { character_id: characterId, metadata: patch });
    setDraftCustomization(prev => ({ ...prev, ...patch }));
  };

  const handleRandomizePool = () => {
    const all = [...soundCatalogById.values()];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const randomIds = all.slice(0, 24).map(s => s.id);
    handleUpdateDraft({ cloudSoundIds: randomIds });
    trackEvent('constellation_randomized', { character_id: characterId });
  };

  const handleRevertPool = () => {
    const identId = draftCustomization.identityId || character.identityId;
    const ident = AVAILABLE_PERFORMERS.find(i => i.id === identId);
    if (ident) {
      handleUpdateDraft({ cloudSoundIds: ident.defaultSounds });
    } else {
      handleUpdateDraft({ cloudSoundIds: character.sounds.map(s => s.id).slice(0, 24) });
    }
    trackEvent('constellation_reverted', { character_id: characterId });
  };

  const handleApply = () => {
    trackEvent('character_applied', { character_id: characterId });
    const finalSounds = activeSounds.slice(0, 6);
    onApply({ ...draftCustomization, soundIds: finalSounds, cloudSoundIds: constellationSounds.map(s => s.id) });
  };

  const handleComboQuickSelect = (comboId: string) => {
    const combo = COMBOS.find(c => c.id === comboId);
    if (!combo) return;

    // Deselect all current active sounds
    activeSounds.forEach(id => {
      const s = soundCatalogById.get(id);
      if (s) onToggleSound(id, s.path);
    });

    // Select combo sounds
    combo.soundIds.forEach(id => {
      const s = soundCatalogById.get(id);
      if (s) onToggleSound(id, s.path);
    });
  };

  const handleComboClick = (comboId: string) => {
    const combo = COMBOS.find(c => c.id === comboId);
    if (!combo) return;

    const allInMix = combo.soundIds.every(id => activeSounds.includes(id));
    if (allInMix) {
      combo.soundIds.forEach(id => {
        const s = soundCatalogById.get(id);
        if (s) onToggleSound(id, s.path);
      });
    } else {
      const nextSounds = [...activeSounds];
      combo.soundIds.forEach(id => {
        if (!nextSounds.includes(id) && nextSounds.length < 6) {
          const s = soundCatalogById.get(id);
          if (s) {
            onToggleSound(id, s.path);
            nextSounds.push(id);
          }
        }
      });
    }
  };

  const handleSoundDoubleClick = (soundId: string, _path: string) => {
    const combos = soundToComboMap[soundId];
    if (combos && combos.length > 0) {
      handleComboClick(combos[0]);
    }
  };

  const groupedLibrary = useMemo(() => {
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

    const grouped: Record<string, SoundOption[]> = {};

    if (libTab === 'chars') {
      const charMapping: Record<string, string[]> = {
        hanako: ['horror', 'polyphon', 'trombone', 'violins', 'laugh', 'cry', 'giggle', 'goat', 'monks'],
        gumi: [],
        alise: []
      };
      
      base.forEach(s => {
        let group = 'other';
        if (charMapping.hanako.includes(s.id) || s.category === 'creepy') group = 'hanako';
        else if (['beats', 'voice', 'melody'].includes(s.category)) group = 'gumi';
        else if (s.category === 'voice') group = 'alise';
        
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(s);
      });
    } else if (!activeFilter) {
      base.forEach(s => {
        const key = libTab === 'cat' ? s.category : (libTab === 'mood' ? s.mood : 'all');
        const finalKey = key || 'other';
        if (!grouped[finalKey]) grouped[finalKey] = [];
        grouped[finalKey].push(s);
      });
    } else {
      return base;
    }
    return grouped;
  }, [character.sounds, libTab, activeFilter, favoriteSoundIds]);

  const filterOptions = useMemo(() => {
    if (libTab === 'cat') return Array.from(new Set(character.sounds.map(s => s.category)));
    if (libTab === 'mood') return Array.from(new Set(character.sounds.map(s => s.mood).filter(Boolean)));
    return [];
  }, [character.sounds, libTab]);

  const renderLibraryItem = (sound: SoundOption) => {
    const isSelectedInCloud = constellationSounds.some(s => s.id === sound.id);
    const isFav = favoriteSoundIds.includes(sound.id);
    const isActiveInMix = activeSounds.includes(sound.id);

    return (
      <div key={sound.id} className={`${styles.libraryItemRow} ${isSelectedInCloud ? styles.itemInCloud : ''}`}>
        <button 
          className={`${styles.libraryItem} ${isSelectedInCloud ? styles.libraryItemActive : ''}`}
          disabled={!isCharacterSelected}
          onClick={() => onPreviewSound(sound.id, sound.path)}
        >
          <div 
            className={styles.libraryItemDot} 
            style={{ background: `var(${sound.colorToken})` }}
          >
             <AudioLines size={8} className={styles.dotIcon} />
          </div>
          <span className={styles.libraryItemName}>{sound.name.toUpperCase()}</span>
        </button>

        <button 
          className={`${styles.selectBtn} ${isSelectedInCloud ? styles.selectBtnActive : ''}`}
          disabled={!isCharacterSelected}
          onClick={(e) => {
             trackEvent('sound_click', { sound_id: sound.id, character_id: characterId, category: isSelectedInCloud ? 'remove' : 'add' });
             const currentIds = constellationSounds.map(s => s.id);
             if (isSelectedInCloud) {
               handleUpdateDraft({ cloudSoundIds: currentIds.filter(id => id !== sound.id) });
               if (isActiveInMix) {
                 onToggleSound(sound.id, sound.path);
               }
             } else {
               if (currentIds.length < 24) {
                 handleUpdateDraft({ cloudSoundIds: [...currentIds, sound.id] });
                 if (!sessionAddedSounds.includes(sound.id)) {
                   setSessionAddedSounds(prev => [...prev, sound.id]);
                 }
                 const messages = ["added!", "added!", "also added!", "sure, added!", "you got it..."];
                 const msg = messages[floatingTextIndexRef.current % messages.length];
                 floatingTextIndexRef.current++;
                 
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = rect.left + rect.width / 2;
                 const y = rect.top;
                 addFloatingText(msg, x, y, `var(${sound.colorToken})`);

                 if (!isActiveInMix) {
                    onToggleSound(sound.id, sound.path);
                 }
               }
             }
          }}
        >
          {isSelectedInCloud ? <SquareCheckBig size={14} /> : <Square size={14} />}
        </button>

        <button className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`} onClick={() => onToggleFavoriteSound(sound.id)}>
          <HeartSolid size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  };

  const renderGroup = (key: string, title: string, sounds: SoundOption[]) => {
    const isCollapsed = collapsedGroups.has(key);
    const hasSelected = sounds.some(s => constellationSounds.some(cs => cs.id === s.id));

    return (
      <div key={key} className={`${styles.libGroup} ${isCollapsed ? styles.libGroupCollapsed : ''}`}>
        <div className={styles.libGroupHeader} onClick={() => toggleGroup(key)}>
          <div className={styles.groupHeaderLeft}>
            <span>{title.toUpperCase()}</span>
            {isCollapsed && hasSelected && (
              <div className={styles.groupIndicators}>
                <Circle size={6} fill="currentColor" className={styles.indicatorIcon} />
              </div>
            )}
          </div>
          <ChevronDown size={10} className={styles.groupArrow} />
        </div>
        {!isCollapsed && <div className={styles.libGroupContent}>{sounds.map(renderLibraryItem)}</div>}
      </div>
    );
  };

  return (
    <div className={styles.profilePage} style={cssVars}>
      <FloatingTextContainer items={floatingItems} />
      {(isLibraryOpen || isComboSidebarOpen) && activeTab === 'sounds' && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => {
            setIsLibraryOpen(false);
            setIsComboSidebarOpen(false);
          }}
        />
      )}
      {/* Sidebar Library */}
      {activeTab === 'sounds' && (
      <aside className={`${styles.librarySidebar} ${isLibraryOpen ? styles.libraryOpen : ''}`}>
        <div className={styles.libraryHandle} onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
          <span className={styles.handleLabel}>{isLibraryOpen ? 'CLOSE' : 'SOUNDS'}</span>
        </div>

        <header className={styles.libraryHeader}>
          <div className={styles.onboardingSteps}>
            <span>1. Identity</span> <ChevronRight size={8} />{' '}
            <span className={styles.onboardingActive}>2. Library</span> <ChevronRight size={8} /> <span>3. Mix</span>{' '}
            <ChevronRight size={8} /> <span>4. Stage</span> <ChevronRight size={8} /> <span>5. Combos</span>
          </div>
          <h6 className={styles.libraryTitle}>SOUND LIBRARY</h6>
          <div className={styles.libTabs}>
            <button
              className={`${styles.libTab} ${libTab === 'favs' ? styles.libTabActive : ''}`}
              disabled={favoriteSoundIds.length === 0}
              onClick={() => {
                setLibTab('favs');
                setActiveFilter(null);
              }}
            >
              FAVS
            </button>
            <button
              className={`${styles.libTab} ${libTab === 'cat' ? styles.libTabActive : ''}`}
              onClick={() => {
                setLibTab('cat');
                setActiveFilter(null);
              }}
            >
              CAT
            </button>
            <button
              className={`${styles.libTab} ${libTab === 'mood' ? styles.libTabActive : ''}`}
              onClick={() => {
                setLibTab('mood');
              }}
            >
              MOOD
            </button>
            <button
              className={`${styles.libTab} ${libTab === 'chars' ? styles.libTabActive : ''}`}
              onClick={() => {
                setLibTab('chars');
                setActiveFilter(null);
              }}
            >
              CHARS
            </button>
          </div>
        </header>

        <div className={styles.libraryScrollWrap}>
          <button
            className={styles.scrollArrow}
            disabled={scrollTop === 0}
            onClick={() => handleScroll('up')}
            onDoubleClick={() => handleScrollJump('top')}
          >
            <ChevronUp size={16} />
          </button>
          <div className={styles.libraryList} ref={scrollRef} onScroll={onListScroll}>
            {!isCharacterSelected ? (
              <div className={styles.libraryEmpty}>PLEASE SELECT IDENTITY FIRST</div>
            ) : Array.isArray(groupedLibrary) ? (
              groupedLibrary.map(renderLibraryItem)
            ) : (
              Object.entries(groupedLibrary).map(([key, sounds]) => renderGroup(key, key, sounds))
            )}
          </div>
          <button
            className={styles.scrollArrow}
            disabled={isBottomReached}
            onClick={() => handleScroll('down')}
            onDoubleClick={() => handleScrollJump('bottom')}
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {isCharacterSelected && (libTab === 'cat' || libTab === 'mood') && (
          <div className={styles.filterBar}>
            {filterOptions.map((opt) => (
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
          <Button
            variant={sessionAddedSounds.length > 0 ? 'primary' : 'secondary'}
            size="sm"
            className={styles.applySelectedBtn}
            onPress={() => {
              setIsLibraryOpen(false);
              setSessionAddedSounds([]);
            }}
          >
            APPLY SELECTED SOUNDS
          </Button>
          <Button variant="secondary" size="sm" className={styles.getMoreBtn} onPress={onNavigateShop}>
            <Music size={12} />
            <span>GET MORE</span>
          </Button>
        </div>
      </aside>
      )}

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backLink} onClick={onClose}>
              <span>BACK TO STAGE</span>
              <ChevronRight size={14} />
            </button>
            <h1 className={styles.characterName}>{characterName}</h1>
            <span className={styles.characterLevel}>{isMain ? 'YOUR IDENTITY' : "FRIEND'S PROFILE"} • LEVEL {unlockedLevel + 1}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </header>

        <div className={styles.profileTabs}>
          <button className={`${styles.tabLink} ${activeTab === 'sounds' ? styles.tabLinkActive : ''}`} onClick={() => handleTabChange('sounds')}>
            <Music size={18} />
            <span>CONSTELLATION</span>
          </button>
          <button className={`${styles.tabLink} ${activeTab === 'identity' ? styles.tabLinkActive : ''}`} onClick={() => handleTabChange('identity')}>
            <UserRoundPen size={18} />
            <span>IDENTITY</span>
          </button>
          <button className={`${styles.tabLink} ${activeTab === 'milestones' ? styles.tabLinkActive : ''}`} onClick={() => handleTabChange('milestones')}>
            <Star size={18} />
            <span>MILESTONES</span>
          </button>
        </div>

        <div className={styles.profileContentArea}>
          {activeTab === 'sounds' && (
            <section className={styles.constellationSection}>
              <div className={styles.constellationHeader}>
                <h2 className={styles.constellationTitle}>THE CONSTELLATION</h2>
                <p className={styles.constellationSubtitle}>Highlight up to 6 sounds for your mix.</p>
              </div>
              
              <div className={styles.constellationStage}>
                <img src={characterImage || CHARACTER_PLACEHOLDER_PATH} alt="" className={styles.characterBg} />
                
                <div className={styles.floatingWrap}>
                  {isCharacterSelected && constellationSounds.map((sound, i) => {
                    const isActive = activeSounds.includes(sound.id);
                    const pos = floatingPositions[i] || { x: 0, y: 0, scale: 1, delay: 0 };
                    const soundCombos = soundToComboMap[sound.id] || [];
                    const isPartOfCompletedCombo = soundCombos.length > 0;
                    const isDimmed = focusedSoundIds && !focusedSoundIds.has(sound.id);
                    const isPulsing = isActive && stageActiveSet.has(sound.id);

                    return (
                      <div 
                        key={sound.id} 
                        className={`${styles.floatingChip} ${isDimmed ? styles.isDimmed : ''}`} 
                        style={{ '--tx': `${pos.x}px`, '--ty': `${pos.y}px`, '--scale': pos.scale, '--delay': `${pos.delay}s` } as CSSProperties}
                        onDoubleClick={() => handleSoundDoubleClick(sound.id, sound.path)}
                      >
                        <Chip 
                          tone={isActive ? 'title' : 'neutral'} 
                          size="md" 
                          className={`${styles.constellationChip} ${isActive ? styles.isActive : ''} ${isPulsing ? styles.isPulsing : ''}`} 
                          onClick={() => {
                             if (!isActive && activeSounds.length >= 6) return;
                             onToggleSound(sound.id, sound.path);
                          }}
                          style={isActive ? ({ '--sound-color': `var(${sound.colorToken})`, background: `var(${sound.colorToken})`, color: '#000', borderColor: 'transparent' } as CSSProperties) : {}}
                        >
                          {sound.name.toUpperCase()}
                          {isPartOfCompletedCombo && <Sparkles size={8} className={styles.comboSparkle} />}
                        </Chip>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.slotSystem}>
                   <span className={styles.slotLabel}>{activeSounds.length} / 6 slots:</span>
                   <div className={styles.slotsWrap}>
                      {[...Array(6)].map((_, i) => {
                         const soundId = activeSounds[i];
                         const isFull = !!soundId;
                         return (
                           <div key={`${i}-${soundId || 'empty'}`} className={`${styles.slot} ${isFull ? styles.slotFull : ''}`}>
                              {isFull ? '' : ''}
                           </div>
                         );
                      })}
                   </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'identity' && (
            <section className={styles.identitySection}>
               <div className={styles.identityLayout}>
                  <div className={styles.identityPreview}>
                     <img src={characterImage || CHARACTER_PLACEHOLDER_PATH} alt="" className={styles.identityImageLarge} />
                  </div>
                  <div className={styles.identityControls}>
                     {/* 1. Name Selection */}
                     <div className={styles.field}>
                        <span className={styles.fieldLabel}>CHARACTER NAME</span>
                        <input 
                          ref={nameInputRef}
                          type="text" 
                          className={styles.textInput} 
                          value={draftCustomization.name || ''} 
                          placeholder={character.name} 
                          onChange={(e) => handleUpdateDraft({ name: e.target.value.slice(0, 12) })} 
                        />
                     </div>

                     {/* 2. Available Chars Selection */}
                     <div className={styles.field}>
                        <div className={styles.fieldHeader}>
                           <span className={styles.fieldLabel}>AVAILABLE CHARS</span>
                           <span className={styles.fieldStatus}>ONE SPOT AT A TIME</span>
                        </div>
                        <div className={styles.identityGrid}>
                          {AVAILABLE_PERFORMERS.map((ident) => {
                            const currentIdentId = draftCustomization.identityId !== undefined ? draftCustomization.identityId : character.identityId;
                            const isSelected = currentIdentId === ident.id;
                            
                            // RULE: Hide if taken by OTHER spots on stage
                            const isTakenByOther = claimedIdentityIds.includes(ident.id) && !isSelected;
                            if (isTakenByOther) return null;

                            const defaultImg = ident.images[0].src;
                            return (
                              <button 
                                key={ident.id} 
                                className={`${styles.identOption} ${isSelected ? styles.identOptionActive : ''}`} 
                                onClick={() =>
                                  handleUpdateDraft({
                                    identityId: ident.id,
                                    image: ident.images[0].src,
                                    name: ident.label,
                                    cloudSoundIds: ident.defaultSounds,
                                  })
                                }
                              >
                                <div className={styles.identOptionImg}>
                                   <img src={defaultImg} alt={ident.label} />
                                </div>
                                <span className={styles.identOptionLabel}>{ident.label.toUpperCase()}</span>
                              </button>
                            );
                          })}
                        </div>
                     </div>

                     {/* 3. Appearance (Image) Selection */}
                     <div className={styles.field}>
                        <div className={styles.fieldHeader}>
                           <span className={styles.fieldLabel}>APPEARANCE</span>
                           {(() => {
                              const identId = draftCustomization.identityId || character.identityId;
                              if (!identId) return null; 
                              
                              const ident = AVAILABLE_PERFORMERS.find(i => i.id === identId);
                              const charLevel = characterLevels[identId] || 0;
                              const nextUpgrade = ident?.images.find(img => img.unlockLevel > charLevel);
                              
                              if (!nextUpgrade) return <span className={styles.fieldStatus}>MAX LEVEL</span>;
                              
                              return (
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  className={styles.upgradeBtn}
                                  onPress={() => onUpgradeCharacter?.(identId, nextUpgrade.unlockLevel)}
                                >
                                  UPGRADE TO LEVEL {nextUpgrade.unlockLevel}
                                </Button>
                              );
                           })()}
                        </div>
                        <div className={styles.imageGrid}>
                          {(() => {
                            const identId = draftCustomization.identityId !== undefined ? draftCustomization.identityId : character.identityId;
                            
                            if (!identId) {
                               return AVAILABLE_PERFORMERS.flatMap(ident => ident.images).map((img) => {
                                 const isSelected = draftCustomization.image === img.src;
                                 return (
                                   <button 
                                     key={`${img.id}-all`} 
                                     className={`${styles.imageOption} ${isSelected ? styles.imageOptionActive : ''}`} 
                                     onClick={() => handleUpdateDraft({ image: img.src })}
                                   >
                                     <img src={img.src} alt={img.label} />
                                   </button>
                                 );
                               });
                            }

                            const ident = AVAILABLE_PERFORMERS.find(i => i.id === identId);
                            const charLevel = characterLevels[identId || ''] || 0;
                            if (!ident) return null;

                            return ident.images.map((img) => {
                              const isSelected = draftCustomization.image === img.src;
                              const isLocked = img.unlockLevel > charLevel;
                              return (
                                <button 
                                  key={img.id} 
                                  className={`${styles.imageOption} ${isSelected ? styles.imageOptionActive : ''} ${isLocked ? styles.imageOptionLocked : ''}`} 
                                  onClick={() => !isLocked && handleUpdateDraft({ image: img.src })}
                                  disabled={isLocked}
                                >
                                  <img src={img.src} alt={img.label} />
                                  {isLocked && (
                                    <div className={styles.lockOverlay}>
                                       <Lock size={12} />
                                       <span>LVL {img.unlockLevel}</span>
                                    </div>
                                  )}
                                </button>
                              );
                            });
                          })()}
                        </div>
                     </div>

                     <div className={styles.identityActions}>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onPress={() => {
                            trackEvent('character_unlinked', { character_id: characterId });
                            handleUpdateDraft({ identityId: null });
                          }}
                        >
                          UNLINK {characterName.toUpperCase()} FROM REALITY
                        </Button>
                        <Button 
                          variant="quiet" 
                          size="sm" 
                          onPress={() => {
                            setDraftCustomization({});
                          }}
                        >
                          RESET SPOT
                        </Button>
                     </div>
                  </div>
               </div>
            </section>
          )}

          {activeTab === 'milestones' && (
            <div className={styles.milestonesArea}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}><Star size={16} style={{ marginRight: 8 }} /> Combo Discovery</h2>
                  <span className={styles.sectionCount}>{discoveredComboIds.length} / {COMBOS.length}</span>
                </div>
                <div className={styles.comboGrid}>
                  {COMBOS.map((combo) => {
                    const isDiscovered = discoveredComboIds.includes(combo.id);
                    const isCurrentlyActive = combo.soundIds.every(id => stageActiveSet.has(id));
                    return (
                      <div key={combo.id} className={`${styles.comboCard} ${!isDiscovered ? styles.isLocked : styles.isDiscovered} ${isCurrentlyActive ? styles.isCurrentlyActive : ''}`}>
                        <span className={`${styles.comboRarity} ${styles[combo.rarity]}`}>{combo.rarity}</span>
                        <h3 className={styles.comboName}>{isDiscovered ? combo.name : '???'} {!isDiscovered && <Lock size={12} style={{ marginLeft: 8, opacity: 0.5 }} />}</h3>
                        <p className={styles.comboDescription}>{isDiscovered ? combo.description : 'Combine secret sounds to reveal.'}</p>
                        {isCurrentlyActive && <div className={styles.activeIndicator}>ACTIVE IN MIX</div>}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}><Trophy size={16} style={{ marginRight: 8 }} /> Milestones</h2>
                </div>
                <div className={styles.achievementList}>
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = [ACHIEVEMENTS[0].id].includes(achievement.id);
                    return (
                      <div key={achievement.id} className={`${styles.achievementItem} ${!isUnlocked ? styles.isLocked : ''}`}>
                        <div className={styles.achievementIcon}><Trophy size={18} /></div>
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
          {activeTab === 'sounds' && (
             <div className={styles.footerLeft}>
               <Button variant="quiet" size="sm" onPress={() => onSetSounds?.([])}>CLEAR</Button>
               <Button variant="quiet" size="sm" onPress={handleRandomizePool}>RANDOM</Button>
               <Button variant="quiet" size="sm" onPress={handleRevertPool}>REVERT</Button>
             </div>
          )}
          <div className={styles.footerRight}>
            {activeTab !== 'sounds' && (
               <Button variant="quiet" size="sm" onPress={handleRevertPool}>REVERT</Button>
            )}
            <Button variant="primary" size="lg" className={styles.applyButton} onPress={handleApply}>APPLY TO STAGE</Button>
          </div>
        </footer>
      </main>

      {/* Combo Sidebar (Right Side) */}
      {activeTab === 'sounds' && (
      <aside className={`${styles.comboSidebar} ${isComboSidebarOpen ? styles.comboSidebarOpen : ''}`}>
        <div className={styles.comboHandle} onClick={() => setIsComboSidebarOpen(!isComboSidebarOpen)}>
          <span className={styles.handleLabel}>{isComboSidebarOpen ? 'CLOSE' : 'COMBOS'}</span>
        </div>
        <header className={styles.libraryHeader}>
          <h6 className={styles.libraryTitle}>COMBO DECK</h6>
        </header>
        <div className={styles.libraryList}>
          {cloudCompletedComboIds.length === 0 ? (
            <div className={styles.libraryEmpty}>DISCOVER COMBOS TO UNLOCK CARDS</div>
          ) : (
            cloudCompletedComboIds.map((comboId) => {
              const combo = COMBOS.find((c) => c.id === comboId)!;
              const isAllSelected = combo.soundIds.every((id) => activeSounds.includes(id));
              return (
                <div
                  key={comboId}
                  className={`${styles.sidebarComboCard} ${isAllSelected ? styles.sidebarComboCardSelected : ''}`}
                  onClick={() => handleComboQuickSelect(comboId)}
                  onMouseEnter={() => setHoveredComboId(comboId)}
                  onMouseLeave={() => setHoveredComboId(null)}
                >
                  {combo.image && <img src={combo.image} alt="" className={styles.sidebarComboImg} />}
                  <div className={styles.sidebarComboInner}>
                    <h4 className={styles.sidebarComboTitle}>{combo.name}</h4>
                    <span className={styles.sidebarComboRarity}>{combo.rarity}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
      )}

      <Notice
        isOpen={isNoticeOpen}
        onClose={() => {
          setIsNoticeOpen(false);
          handleTabChange('identity');
        }}
        title="Identity Required"
        message="Please select a character identity before choosing sounds for your mix."
        okLabel="GO TO IDENTITY"
      />
    </div>
  );
}
