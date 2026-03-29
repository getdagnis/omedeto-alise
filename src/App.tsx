import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faXmark, faPen } from '@fortawesome/free-solid-svg-icons';
import styles from './App.module.sass';
import CharacterGrid from './components/CharacterGrid';
import EditCharacterModal from './components/EditCharacterModal';
import ProgressionMeter from './components/ProgressionMeter';
import { useProgression } from './hooks/useProgression';
import {
  ALL_SOUNDS,
  BACKGROUND_IMAGE_KEYS,
  CHARACTER_COLOR_TOKENS,
  CHARACTER_IMAGE_OPTIONS,
  CHARACTERS,
} from './config';

const GLITCH_PREF_KEY = 'gumi-alise-glitch-mode';
const DEFAULT_GLITCH_MODE: 'stable' | 'glitch' = 'stable';
const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const BG_DESKTOP_SUFFIX = '1920';
const BG_MOBILE_SUFFIX = 'mob';
const GLOW_BURST_MS = 2200;
const MAX_SOUNDS_TOTAL = 12;

const COMBO_WORDS = [
  {
    id: 'starlight',
    word: 'Starlight!',
    soundIds: ['ok', 'energy', 'fly-me'],
  },
  {
    id: 'cosmic',
    word: 'Cosmic!',
    soundIds: ['synth-rise', 'synth-space', 'synth-night'],
  },
  {
    id: 'mischief',
    word: 'Mischief!',
    soundIds: ['laugh', 'laugh-2', 'laugh-3'],
  },
  {
    id: 'encore',
    word: 'Encore!',
    soundIds: ['beat-1', 'beat-2', 'beat-3'],
  },
] as const;

const getStoredGlitchMode = (): 'stable' | 'glitch' => {
  if (typeof window === 'undefined') {
    return DEFAULT_GLITCH_MODE;
  }

  try {
    const stored = window.localStorage.getItem(GLITCH_PREF_KEY);
    if (stored === 'stable' || stored === 'glitch') {
      return stored;
    }
    return DEFAULT_GLITCH_MODE;
  } catch {
    return DEFAULT_GLITCH_MODE;
  }
};

const createGlitchOverlayVars = (): CSSProperties => {
  const stripeWidth = 7 + Math.random() * 7;
  const darkA = 0.16 + Math.random() * 0.1;
  const darkB = 0.11 + Math.random() * 0.09;
  const light = 0.03 + Math.random() * 0.04;
  const thickWidth = 16 + Math.random() * 24;
  const thickGap = 180 + Math.random() * 150;
  const thickOpacity = 0.07 + Math.random() * 0.08;
  const offsetX = Math.floor(Math.random() * 42);

  return {
    '--glitch-stripe-width': `${stripeWidth.toFixed(2)}px`,
    '--glitch-dark-a': `rgba(0, 0, 0, ${darkA.toFixed(3)})`,
    '--glitch-dark-b': `rgba(0, 0, 0, ${darkB.toFixed(3)})`,
    '--glitch-light': `rgba(255, 255, 255, ${light.toFixed(3)})`,
    '--glitch-thick-width': `${thickWidth.toFixed(2)}px`,
    '--glitch-thick-gap': `${thickGap.toFixed(2)}px`,
    '--glitch-thick-opacity': `${thickOpacity.toFixed(3)}`,
    '--glitch-offset-x': `${offsetX}px`,
  } as CSSProperties;
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });

const buildBackgroundImagePath = (backgroundKey: string, suffix: string) => `/${backgroundKey}-${suffix}.jpg`;

const getIsMobileVerticalDevice = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  return isPortrait && hasCoarsePointer;
};

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
  soundIds?: string[];
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

const CHARACTER_CUSTOM_STORAGE_KEY = 'gumi-alise-character-custom-v2';

const parseCharacterCustomStorage = (): CharacterCustomizationMap => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(CHARACTER_CUSTOM_STORAGE_KEY);
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const sanitized: CharacterCustomizationMap = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (!value || typeof value !== 'object') {
        return;
      }

      const typed = value as CharacterCustomization;
      const next: CharacterCustomization = {};

      if (typeof typed.name === 'string') {
        next.name = typed.name.slice(0, 32);
      }
      if (Array.isArray(typed.colorModes)) {
        next.colorModes = typed.colorModes.filter((c) => typeof c === 'string').slice(0, 3);
      }
      if (typeof typed.image === 'string') {
        next.image = typed.image;
      }
      if (Array.isArray(typed.soundIds)) {
        next.soundIds = typed.soundIds.filter((s) => typeof s === 'string').slice(0, 12);
      }

      sanitized[key] = next;
    });

    return sanitized;
  } catch {
    return {};
  }
};

const persistCharacterCustomStorage = (customMap: CharacterCustomizationMap) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CHARACTER_CUSTOM_STORAGE_KEY, JSON.stringify(customMap));
  } catch {
    // Ignore quota errors
  }
};

const CHARACTER_COLOR_OPTIONS = [
  { id: 'auto', label: 'Default (Sound)', value: 'auto' },
  ...CHARACTER_COLOR_TOKENS.map((token, index) => ({
    id: `tokyo-${index + 1}`,
    label: `Tokyo ${index + 1}`,
    value: token,
  })),
] as const;

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }, []);

  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isMobileVerticalDevice, setIsMobileVerticalDevice] = useState(() => getIsMobileVerticalDevice());
  const [isBackgroundRotationReady, setIsBackgroundRotationReady] = useState(false);

  const [favoriteCharacterId, setFavoriteCharacterId] = useState<string>(() => '');

  const [activeSoundsByCharacter, setActiveSoundsByCharacter] = useState<Record<string, string[]>>({});
  const [loadedCharacterMap, setLoadedCharacterMap] = useState<Record<string, boolean>>({});
  const [characterCustomizations, setCharacterCustomizations] = useState<CharacterCustomizationMap>(() =>
    parseCharacterCustomStorage(),
  );
  const [mutedCharacterIds, setMutedCharacterIds] = useState<Set<string>>(new Set());
  const [pickingSoundsCharacterId, setPickingSoundsCharacterId] = useState<string | null>(null);
  const [initialEditTab, setInitialEditTab] = useState<'colors' | 'sounds'>('colors');

  const editingCharacterId = useMemo(() => {
    const match = currentPath.match(/^\/(.+)\/edit$/);
    return match ? match[1] : null;
  }, [currentPath]);

  const [isGlowBurst, setIsGlowBurst] = useState(false);
  const [comboWord, setComboWord] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<'stable' | 'glitch'>(() => getStoredGlitchMode());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchOverlayVars, setGlitchOverlayVars] = useState<CSSProperties>(() => createGlitchOverlayVars());

  const savedScrollPositionRef = useRef<number>(0);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingSoundId, setPreviewingSoundId] = useState<string | null>(null);

  const soundCatalogById = useMemo(() => new Map(ALL_SOUNDS.map((sound) => [sound.id, sound] as const)), []);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const activeSoundOrderRef = useRef<Array<{ characterId: string; soundId: string }>>([]);
  const totalActiveSoundsRef = useRef(0);
  const glowBurstTimeoutRef = useRef<number | null>(null);
  const activeComboIdRef = useRef<string | null>(null);

  const {
    state: progressionState,
    currentLevelInfo,
    nextLevelInfo,
    recordSoundPlayed,
    recordCharacterCustomized,
  } = useProgression();

  useEffect(() => {
    if (editingCharacterId) {
      // Modal is opening
      savedScrollPositionRef.current = window.scrollY;
      window.scrollTo(0, 0);
    } else {
      // Modal is closing (or was never open)
      // Only restore if we have a saved position (avoids jumping on initial load)
      if (savedScrollPositionRef.current !== 0) {
        window.scrollTo(0, savedScrollPositionRef.current);
        savedScrollPositionRef.current = 0;
      }
    }
  }, [editingCharacterId]);
  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRefs.current = {};
    activeSoundOrderRef.current = [];
  }, []);

  const triggerGlowBurst = useCallback(() => {
    if (glowBurstTimeoutRef.current) {
      window.clearTimeout(glowBurstTimeoutRef.current);
    }

    setIsGlowBurst(true);
    glowBurstTimeoutRef.current = window.setTimeout(() => {
      setIsGlowBurst(false);
    }, GLOW_BURST_MS);
  }, []);

  const buildAudioKey = useCallback((characterId: string, soundId: string) => `${characterId}:${soundId}`, []);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!pickingSoundsCharacterId && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setTimeout(() => {
        setPreviewingSoundId(null);
      }, 0);
    }
  }, [pickingSoundsCharacterId]);

  const togglePreviewSound = useCallback((soundId: string, path: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }

    if (previewingSoundId === soundId) {
      setPreviewingSoundId(null);
      return;
    }

    const audio = new Audio(path);
    audio.loop = false;
    audio.onended = () => setPreviewingSoundId(null);
    void audio.play().catch(() => undefined);
    previewAudioRef.current = audio;
    setPreviewingSoundId(soundId);
  }, [previewingSoundId]);

  const toggleMuteCharacter = useCallback((characterId: string) => {
    setMutedCharacterIds((previous) => {
      const next = new Set(previous);
      const isMuting = !next.has(characterId);

      if (isMuting) {
        next.add(characterId);
      } else {
        next.delete(characterId);
      }

      Object.entries(audioRefs.current).forEach(([key, audio]) => {
        if (key.startsWith(`${characterId}:`)) {
          audio.muted = isMuting;
          if (isMuting) {
            audio.pause();
          } else {
            void audio.play().catch(() => undefined);
          }
        }
      });

      return next;
    });
  }, []);

  const unmuteCharacter = useCallback((characterId: string) => {
    setMutedCharacterIds((prev) => {
      if (prev.has(characterId)) {
        const next = new Set(prev);
        next.delete(characterId);
        Object.entries(audioRefs.current).forEach(([key, audio]) => {
          if (key.startsWith(`${characterId}:`)) {
            audio.muted = false;
            void audio.play().catch(() => undefined);
          }
        });
        return next;
      }
      return prev;
    });
  }, []);

  const setSingleSound = useCallback(
    (characterId: string, soundId: string) => {
      const sound = soundCatalogById.get(soundId);
      if (!sound) return;

      recordSoundPlayed(characterId, soundId);
      unmuteCharacter(characterId);

      const audioKey = buildAudioKey(characterId, soundId);
      const isRemoving = activeSoundsByCharacter[characterId]?.includes(soundId);

      if (isRemoving) {
        // Stop and remove the specific sound
        const audio = audioRefs.current[audioKey];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          delete audioRefs.current[audioKey];
        }
        activeSoundOrderRef.current = activeSoundOrderRef.current.filter(
          (e) => !(e.characterId === characterId && e.soundId === soundId)
        );
      } else {
        // Prepare to add new sound
        const currentActive = activeSoundsByCharacter[characterId] ?? [];
        const maxSounds = currentLevelInfo.soundsPerCharacter;

        if (currentActive.length >= maxSounds) {
          // Find and stop the oldest sound
          const oldestSoundId = currentActive[0];
          if (oldestSoundId) {
            const oldAudioKey = buildAudioKey(characterId, oldestSoundId);
            const oldAudio = audioRefs.current[oldAudioKey];
            if (oldAudio) {
              oldAudio.pause();
              oldAudio.currentTime = 0;
              delete audioRefs.current[oldAudioKey];
            }
            activeSoundOrderRef.current = activeSoundOrderRef.current.filter(
              (e) => !(e.characterId === characterId && e.soundId === oldestSoundId)
            );
          }
        }

        // Play the new sound
        const nextAudio = new Audio(sound.path);
        nextAudio.loop = true;
        nextAudio.volume = 1;
        void nextAudio.play().catch(() => undefined);
        audioRefs.current[audioKey] = nextAudio;
        activeSoundOrderRef.current.push({ characterId, soundId });
      }

      // Update state
      setActiveSoundsByCharacter((previous) => {
        const current = previous[characterId] ?? [];
        let nextList: string[];

        if (isRemoving) {
          nextList = current.filter((id) => id !== soundId);
        } else {
          const maxSounds = currentLevelInfo.soundsPerCharacter;
          nextList = current.length >= maxSounds ? [...current.slice(1), soundId] : [...current, soundId];
        }

        return { ...previous, [characterId]: nextList };
      });

      if (currentLevelInfo.soundsPerCharacter === 1) {
        setPickingSoundsCharacterId(null);
      }
    },
    [buildAudioKey, soundCatalogById, unmuteCharacter, recordSoundPlayed, currentLevelInfo.soundsPerCharacter, activeSoundsByCharacter],
  );

  const resetCharacter = useCallback(
    (characterId: string) => {
      unmuteCharacter(characterId);

      // Stop all sounds for this character
      const currentActive = activeSoundsByCharacter[characterId] ?? [];
      currentActive.forEach((soundId) => {
        const audioKey = buildAudioKey(characterId, soundId);
        const audio = audioRefs.current[audioKey];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          delete audioRefs.current[audioKey];
        }
      });

      activeSoundOrderRef.current = activeSoundOrderRef.current.filter((e) => e.characterId !== characterId);

      setActiveSoundsByCharacter((previous) => ({
        ...previous,
        [characterId]: [],
      }));
    },
    [buildAudioKey, unmuteCharacter, activeSoundsByCharacter],
  );

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      const soundIds = activeSoundsByCharacter[characterId] ?? [];
      if (soundIds.length > 0) {
        toggleMuteCharacter(characterId);
      }
    },
    [activeSoundsByCharacter, toggleMuteCharacter],
  );

  const handleToggleFavorite = useCallback((characterId: string) => {
    setFavoriteCharacterId((prev) => (prev === characterId ? '' : characterId));
  }, []);

  const handleCharacterImageLoad = useCallback((characterId: string) => {
    setLoadedCharacterMap((previous) => {
      if (previous[characterId]) return previous;
      return { ...previous, [characterId]: true };
    });
  }, []);

  const resetBoard = useCallback(() => {
    stopAllAudio();
    setActiveSoundsByCharacter({});
    setIsGlowBurst(false);
    activeComboIdRef.current = null;
    setComboWord(null);
  }, [stopAllAudio]);

  const toggleRenderMode = useCallback(() => {
    if (renderMode === 'glitch') {
      setRenderMode('stable');
      return;
    }
    setGlitchOverlayVars(createGlitchOverlayVars());
    setRenderMode('glitch');
  }, [renderMode]);

  useEffect(() => {
    if (!isBackgroundRotationReady || BACKGROUND_IMAGE_KEYS.length < 2) return;
    const interval = window.setInterval(() => {
      setBackgroundIndex((previous) => (previous + 1) % BACKGROUND_IMAGE_KEYS.length);
    }, 9000);
    return () => window.clearInterval(interval);
  }, [isBackgroundRotationReady]);

  useEffect(() => {
    const updateViewportType = () => setIsMobileVerticalDevice(getIsMobileVerticalDevice());
    updateViewportType();
    const orientationQuery = window.matchMedia('(orientation: portrait)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    orientationQuery.addEventListener('change', updateViewportType);
    pointerQuery.addEventListener('change', updateViewportType);
    window.addEventListener('resize', updateViewportType);
    return () => {
      orientationQuery.removeEventListener('change', updateViewportType);
      pointerQuery.removeEventListener('change', updateViewportType);
      window.removeEventListener('resize', updateViewportType);
    };
  }, []);

  useEffect(() => {
    void Promise.all([
      preloadImage('/bg1-1920.jpg'),
      preloadImage('/bg1-mob.jpg'),
      ...CHARACTER_IMAGE_OPTIONS.map((option) => preloadImage(option.src)),
      preloadImage(CHARACTER_PLACEHOLDER_PATH),
    ]);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const preloadRemainingBackgrounds = async () => {
      const suffix = getIsMobileVerticalDevice() ? BG_MOBILE_SUFFIX : BG_DESKTOP_SUFFIX;
      const remainingBackgrounds = BACKGROUND_IMAGE_KEYS.slice(1).map((backgroundKey) =>
        buildBackgroundImagePath(backgroundKey, suffix),
      );
      await Promise.all(remainingBackgrounds.map((src) => preloadImage(src)));
      if (!isCancelled) setIsBackgroundRotationReady(true);
    };
    void preloadRemainingBackgrounds();
    return () => {
      isCancelled = true;
    };
  }, [isMobileVerticalDevice]);

  useEffect(() => () => stopAllAudio(), [stopAllAudio]);

  useEffect(() => {
    try {
      window.localStorage.setItem(GLITCH_PREF_KEY, renderMode);
    } catch {
      // Ignore storage errors
    }
  }, [renderMode]);

  useEffect(() => {
    const total = Object.values(activeSoundsByCharacter).reduce((sum, ids) => sum + ids.length, 0);
    if (total >= MAX_SOUNDS_TOTAL && totalActiveSoundsRef.current < MAX_SOUNDS_TOTAL) {
      setTimeout(() => {
        triggerGlowBurst();
      }, 0);
    }
    totalActiveSoundsRef.current = total;
  }, [activeSoundsByCharacter, triggerGlowBurst]);

  useEffect(() => {
    const activeSet = new Set(Object.values(activeSoundsByCharacter).flat());
    const matchedCombo = COMBO_WORDS.find((combo) => combo.soundIds.every((soundId) => activeSet.has(soundId)));
    if (!matchedCombo || activeComboIdRef.current === matchedCombo.id) return;
    activeComboIdRef.current = matchedCombo.id;
    setTimeout(() => {
      setComboWord(matchedCombo.word);
    }, 0);
    window.setTimeout(() => setComboWord(null), 2200);
  }, [activeSoundsByCharacter]);

  const persistTimeoutRef = useRef<number | null>(null);

  const persistCharacterCustomStorageDebounced = useCallback((customMap: CharacterCustomizationMap) => {
    if (persistTimeoutRef.current) {
      window.clearTimeout(persistTimeoutRef.current);
    }
    persistTimeoutRef.current = window.setTimeout(() => {
      persistCharacterCustomStorage(customMap);
      persistTimeoutRef.current = null;
    }, 500);
  }, []);

  const updateCharacterCustomization = useCallback(
    (characterId: string, patch: CharacterCustomization) => {
      recordCharacterCustomized(characterId);
      setCharacterCustomizations((previous) => {
        const current = previous[characterId] ?? {};
        const next = { ...previous, [characterId]: { ...current, ...patch } };
        persistCharacterCustomStorageDebounced(next);
        return next;
      });
    },
    [persistCharacterCustomStorageDebounced, recordCharacterCustomized],
  );

  const handleRandomizeSounds = useCallback((characterId: string) => {
    const character = CHARACTERS.find((c) => c.id === characterId);
    if (!character) return;

    const availableSounds = character.sounds;
    const shuffled = [...availableSounds].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 12).map((s) => s.id);

    updateCharacterCustomization(characterId, { soundIds: selectedIds });
  }, [updateCharacterCustomization]);

  const activeBackgroundImage = useMemo(() => {
    const activeBackgroundKey = BACKGROUND_IMAGE_KEYS[backgroundIndex] ?? BACKGROUND_IMAGE_KEYS[0];
    const suffix = isMobileVerticalDevice ? BG_MOBILE_SUFFIX : BG_DESKTOP_SUFFIX;
    return buildBackgroundImagePath(activeBackgroundKey, suffix);
  }, [backgroundIndex, isMobileVerticalDevice]);

  const activeCharacter = CHARACTERS.find((c) => c.id === favoriteCharacterId) || CHARACTERS[0];
  const activeScheme = activeCharacter?.schemes?.[0] ?? {
    titleColor: 'white',
    primaryColor: '#600b87cc',
    secondaryColor: '#ff0040a1',
    soundboardColor: '#29063acc',
  };

  const handleGlitchMenuAction = () => {
    toggleRenderMode();
    setIsMenuOpen(false);
  };

  return (
    <div className={`${styles.page} ${renderMode === 'glitch' ? styles.pageGlitch : ''}`} style={glitchOverlayVars}>
      <div className={styles.background} style={{ backgroundImage: `url(${activeBackgroundImage})` }} />
      <div className={styles.backgroundOverlay} />

      <main className={styles.content}>
        <section
          className={styles.panel}
          style={
            {
              '--character-title': activeScheme.titleColor,
              '--character-primary': activeScheme.primaryColor,
              '--character-secondary': activeScheme.secondaryColor,
              '--character-soundboard': activeScheme.soundboardColor,
            } as CSSProperties
          }
        >
          <header className={styles.titleBlock}>
            <h1 className={styles.titleJapanese}>おめでとう、</h1>
            <p className={styles.titleRomanized}>(OMEDETO)</p>
            <p className={styles.titleName}>ALISE!</p>
          </header>

          <CharacterGrid
            characters={CHARACTERS}
            favoriteCharacterId={favoriteCharacterId}
            customizations={characterCustomizations}
            activeSoundsByCharacter={activeSoundsByCharacter}
            mutedCharacterIds={mutedCharacterIds}
            soundCatalogById={soundCatalogById}
            loadedCharacterMap={loadedCharacterMap}
            isGlowBurst={isGlowBurst}
            comboWord={comboWord}
            onSelectCharacter={handleCharacterClick}
            onToggleFavorite={handleToggleFavorite}
            onDropSound={(event, characterId) => {
              event.preventDefault();
              const soundId = event.dataTransfer.getData('text/plain');
              if (soundId) setSingleSound(characterId, soundId);
            }}
            onImageLoad={handleCharacterImageLoad}
            onEditCharacter={(characterId) => {
              setInitialEditTab('colors');
              navigate(`/${characterId}/edit`);
            }}
            onResetCharacter={resetCharacter}
            onOpenSoundPicker={(characterId) => setPickingSoundsCharacterId(characterId)}
          />
        </section>

        <EditCharacterModal
          isOpen={Boolean(editingCharacterId)}
          characters={CHARACTERS}
          editingCharacterId={editingCharacterId}
          customizations={characterCustomizations}
          activeSoundsByCharacter={activeSoundsByCharacter}
          soundCatalogById={soundCatalogById}
          colorOptions={CHARACTER_COLOR_OPTIONS}
          imageOptions={CHARACTER_IMAGE_OPTIONS}
          initialTab={initialEditTab}
          onClose={() => navigate('/')}
          onSelectCharacter={(id) => navigate(`/${id}/edit`)}
          onUpdateCustomization={(id, patch) => updateCharacterCustomization(id, patch)}
        />

        {pickingSoundsCharacterId && (
          <>
            <div className={styles.backdrop} onClick={() => setPickingSoundsCharacterId(null)} />
            <div className={styles.pickerOverlay} role="dialog" aria-modal="true" aria-label="Add sound">
              <div className={styles.pickerCard}>
                <header className={styles.pickerHeader}>
                  <div className={styles.pickerHeaderLeft}>
                    <h3 className={styles.pickerTitle}>SELECT LOOP</h3>
                    <button
                      type="button"
                      className={styles.editSoundsButton}
                      onClick={() => {
                        setInitialEditTab('sounds');
                        const charId = pickingSoundsCharacterId;
                        setPickingSoundsCharacterId(null);
                        navigate(`/${charId}/edit`);
                      }}
                      aria-label="Edit sounds"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setPickingSoundsCharacterId(null)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </header>
                <div className={styles.pickerContent}>
                  {(() => {
                    const characterId = pickingSoundsCharacterId;
                    if (!characterId) return null;

                    const customSoundIds = characterCustomizations[characterId]?.soundIds;
                    
                    if (!customSoundIds || customSoundIds.length === 0) {
                      return (
                        <div className={styles.emptyPickerState}>
                          <p className={styles.emptyPickerText}>No sounds assigned to this character yet.</p>
                          <div className={styles.emptyPickerActions}>
                            <button
                              type="button"
                              className={styles.emptyPickerButton}
                              onClick={() => {
                                setInitialEditTab('sounds');
                                setPickingSoundsCharacterId(null);
                                navigate(`/${characterId}/edit`);
                              }}
                            >
                              SELECT SOUNDS
                            </button>
                            <button
                              type="button"
                              className={styles.emptyPickerButton}
                              onClick={() => handleRandomizeSounds(characterId)}
                            >
                              RANDOM SOUNDS
                            </button>
                          </div>
                        </div>
                      );
                    }

                    const availableSounds = customSoundIds
                      .map(id => soundCatalogById.get(id))
                      .filter((s): s is NonNullable<typeof s> => Boolean(s));

                    return (
                      <div className={styles.pickerList}>
                        {availableSounds.map((sound) => {
                          const characterSounds = activeSoundsByCharacter[characterId] ?? [];
                          const isActive = characterSounds.includes(sound.id);
                          const isPreviewing = previewingSoundId === sound.id;

                          return (
                            <div
                              key={sound.id}
                              className={`${styles.pickerItemWrap} ${isActive ? styles.pickerItemActive : ''}`}
                              style={{ '--sound-color': `var(${sound.colorToken})` } as CSSProperties}
                            >
                              <button
                                type="button"
                                className={`${styles.pickerItemPreview} ${isPreviewing ? styles.pickerItemPreviewing : ''}`}
                                onClick={() => togglePreviewSound(sound.id, sound.path)}
                                aria-label={isPreviewing ? "Stop preview" : "Preview sound"}
                              >
                                <FontAwesomeIcon icon={faVolumeHigh} />
                              </button>
                              <button
                                type="button"
                                className={styles.pickerItemSelect}
                                onClick={() => setSingleSound(characterId, sound.id)}
                              >
                                <span>{sound.name.toUpperCase()}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </>
        )}

        <button type="button" className={styles.refreshButton} onClick={resetBoard}>
          Reset Board
        </button>

        <div className={styles.hamburgerWrap}>
          <button type="button" className={styles.hamburgerButton} onClick={() => setIsMenuOpen((prev) => !prev)}>
            ☰
          </button>
          {isMenuOpen && (
            <div id="main-menu" className={styles.hamburgerMenu} role="menu">
              <button type="button" className={styles.hamburgerItem} onClick={handleGlitchMenuAction}>
                Glitch: {renderMode === 'glitch' ? 'Off' : 'On'}
              </button>
            </div>
          )}
        </div>

        <ProgressionMeter state={progressionState} currentLevelInfo={currentLevelInfo} nextLevelInfo={nextLevelInfo} />
      </main>
    </div>
  );
}

export default App;
