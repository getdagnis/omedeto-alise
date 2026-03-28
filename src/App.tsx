import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, DragEvent, TouchEvent } from 'react';
import styles from './App.module.sass';
import { ALL_SOUNDS, BACKGROUND_IMAGE_KEYS, CHARACTERS, type SoundOption } from './config';

const VISIBLE_SOUND_COUNT = 20;
const GLITCH_PREF_KEY = 'gumi-alise-glitch-mode';
const CHARACTER_SCHEME_COOKIE = 'gumi-alise-character-schemes';
const DEFAULT_GLITCH_MODE: 'stable' | 'glitch' = 'stable';
const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const BG_DESKTOP_SUFFIX = '1920';
const BG_MOBILE_SUFFIX = 'mob';
const GLOW_METER_MAX = 100;
const GLOW_METER_BASE_GAIN = 6;
const GLOW_METER_MATCH_GAIN = 12;
const GLOW_BURST_MS = 2200;
const ULTRA_MODE_MS = 10000;
const CHEER_DURATION_MS = 5000;

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

const CHEER_SOUND_PATHS = ['/hanako/applause.mp3', '/hanako/choir.mp3', '/hanako/laugh.mp3'] as const;

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

const getRandomSounds = (sounds: SoundOption[], count: number) => {
  if (sounds.length <= count) {
    return [...sounds];
  }

  const selectedIndexes = new Set<number>();

  while (selectedIndexes.size < count) {
    selectedIndexes.add(Math.floor(Math.random() * sounds.length));
  }

  // Preserve original array order while still selecting random sounds.
  return sounds.filter((_, index) => selectedIndexes.has(index));
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

type CharacterSchemeMap = Record<string, number>;
type TempoKey = 'slow' | 'fast';

const parseCharacterSchemeCookie = (): CharacterSchemeMap => {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CHARACTER_SCHEME_COOKIE}=`));

  if (!cookieEntry) {
    return {};
  }

  const rawValue = cookieEntry.split('=').slice(1).join('=');

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const sanitized: CharacterSchemeMap = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
        sanitized[key] = value;
      }
    });

    return sanitized;
  } catch {
    return {};
  }
};

const persistCharacterSchemeCookie = (schemeMap: CharacterSchemeMap) => {
  if (typeof document === 'undefined') {
    return;
  }

  const encoded = encodeURIComponent(JSON.stringify(schemeMap));
  document.cookie = `${CHARACTER_SCHEME_COOKIE}=${encoded}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

function App() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isMobileVerticalDevice, setIsMobileVerticalDevice] = useState(() => getIsMobileVerticalDevice());
  const [isBackgroundRotationReady, setIsBackgroundRotationReady] = useState(false);
  const [activeCharacterId, setActiveCharacterId] = useState(() => CHARACTERS[0]?.id ?? '');
  const [activeSoundsByCharacter, setActiveSoundsByCharacter] = useState<Record<string, string[]>>({});
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [loadedCharacterMap, setLoadedCharacterMap] = useState<Record<string, boolean>>({});
  const [characterSchemeMap, setCharacterSchemeMap] = useState<CharacterSchemeMap>(() => parseCharacterSchemeCookie());
  const [glowMeter, setGlowMeter] = useState(0);
  const [isGlowBurst, setIsGlowBurst] = useState(false);
  const [isUltraMode, setIsUltraMode] = useState(false);
  const [comboWord, setComboWord] = useState<string | null>(null);
  const [isCheerActive, setIsCheerActive] = useState(false);
  const [renderMode, setRenderMode] = useState<'stable' | 'glitch'>(() => getStoredGlitchMode());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchOverlayVars, setGlitchOverlayVars] = useState<CSSProperties>(() => createGlitchOverlayVars());
  const [touchDraggedSound, setTouchDraggedSound] = useState<string | null>(null);
  const defaultCharacter = CHARACTERS[0];
  const [visibleSounds, setVisibleSounds] = useState<SoundOption[]>(() =>
    getRandomSounds(ALL_SOUNDS, VISIBLE_SOUND_COUNT),
  );

  const activeCharacter = CHARACTERS.find((character) => character.id === activeCharacterId) ?? defaultCharacter;
  const activeSchemeIndex = useMemo(() => {
    if (!activeCharacter) {
      return 0;
    }

    const storedIndex = characterSchemeMap[activeCharacter.id];
    if (
      typeof storedIndex === 'number' &&
      Number.isInteger(storedIndex) &&
      storedIndex >= 0 &&
      storedIndex < activeCharacter.schemes.length
    ) {
      return storedIndex;
    }

    return 0;
  }, [activeCharacter, characterSchemeMap]);
  const activeScheme = activeCharacter?.schemes[activeSchemeIndex] ?? {
    titleColor: activeCharacter?.titleColor ?? 'white',
    primaryColor: activeCharacter?.primaryColor ?? '#600b87cc',
    secondaryColor: activeCharacter?.secondaryColor ?? '#ff0040a1',
    soundboardColor: activeCharacter?.soundboardColor ?? '#29063acc',
  };
  const activeSoundIds = activeCharacter ? activeSoundsByCharacter[activeCharacter.id] ?? [] : [];
  const isUltraReady = glowMeter >= GLOW_METER_MAX;
  const glowPercent = Math.round((glowMeter / GLOW_METER_MAX) * 100);
  const ultraLabel = isUltraMode ? 'Ultra Active' : isUltraReady ? 'Ultra Mode' : `Ultra ${glowPercent}%`;
  const isCheerVisible = activeSoundIds.length >= 3;
  const activeBackgroundSuffix = isMobileVerticalDevice ? BG_MOBILE_SUFFIX : BG_DESKTOP_SUFFIX;
  const activeBackgroundImage = useMemo(() => {
    const activeBackgroundKey = BACKGROUND_IMAGE_KEYS[backgroundIndex] ?? BACKGROUND_IMAGE_KEYS[0];
    return buildBackgroundImagePath(activeBackgroundKey, activeBackgroundSuffix);
  }, [activeBackgroundSuffix, backgroundIndex]);

  const soundCatalogById = useMemo(() => new Map(ALL_SOUNDS.map((sound) => [sound.id, sound] as const)), []);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const lastTempoRef = useRef<TempoKey | null>(null);
  const glowBurstTimeoutRef = useRef<number | null>(null);
  const ultraModeTimeoutRef = useRef<number | null>(null);
  const cheerAudioRef = useRef<HTMLAudioElement | null>(null);
  const cheerTimeoutRef = useRef<number | null>(null);
  const comboTimeoutRef = useRef<number | null>(null);
  const activeComboIdRef = useRef<string | null>(null);

  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRefs.current = {};
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

  const bumpGlowMeter = useCallback(
    (sound: SoundOption) => {
      setGlowMeter((previous) => {
        if (previous >= GLOW_METER_MAX) {
          return previous;
        }

        const lastTempo = lastTempoRef.current;
        const nextTempo: TempoKey = sound.animation === 'both' ? lastTempo ?? 'slow' : sound.animation;
        const isMatch = lastTempo ? nextTempo === lastTempo : false;
        lastTempoRef.current = nextTempo;

        const gain = isMatch ? GLOW_METER_MATCH_GAIN : GLOW_METER_BASE_GAIN;
        const next = Math.min(GLOW_METER_MAX, previous + gain);

        if (next >= GLOW_METER_MAX && previous < GLOW_METER_MAX) {
          triggerGlowBurst();
        }

        return next;
      });
    },
    [triggerGlowBurst],
  );

  const stopCheerAudio = useCallback(() => {
    if (cheerTimeoutRef.current) {
      window.clearTimeout(cheerTimeoutRef.current);
      cheerTimeoutRef.current = null;
    }

    if (cheerAudioRef.current) {
      cheerAudioRef.current.pause();
      cheerAudioRef.current.currentTime = 0;
      cheerAudioRef.current = null;
    }

    setIsCheerActive(false);
  }, []);

  const playCheer = useCallback(() => {
    if (isCheerActive) {
      return;
    }

    stopCheerAudio();
    const nextPath = CHEER_SOUND_PATHS[Math.floor(Math.random() * CHEER_SOUND_PATHS.length)];
    const audio = new Audio(nextPath);
    audio.volume = 0.9;
    void audio.play().catch(() => undefined);
    cheerAudioRef.current = audio;
    setIsCheerActive(true);
    cheerTimeoutRef.current = window.setTimeout(() => {
      stopCheerAudio();
    }, CHEER_DURATION_MS);
  }, [isCheerActive, stopCheerAudio]);

  const activateUltraMode = useCallback(() => {
    if (isUltraMode || glowMeter < GLOW_METER_MAX) {
      return;
    }

    if (ultraModeTimeoutRef.current) {
      window.clearTimeout(ultraModeTimeoutRef.current);
    }

    setIsUltraMode(true);
    setGlowMeter(0);
    lastTempoRef.current = null;
    ultraModeTimeoutRef.current = window.setTimeout(() => {
      setIsUltraMode(false);
    }, ULTRA_MODE_MS);
  }, [glowMeter, isUltraMode]);

  const buildAudioKey = useCallback((characterId: string, soundId: string) => `${characterId}:${soundId}`, []);

  const enableSound = useCallback(
    (characterId: string, soundId: string, forceBump = false) => {
      const sound = soundCatalogById.get(soundId);
      if (!sound) {
        return;
      }

      const audioKey = buildAudioKey(characterId, soundId);
      const existingAudio = audioRefs.current[audioKey];
      if (existingAudio) {
        existingAudio.currentTime = 0;
        void existingAudio.play().catch(() => undefined);
      } else {
        const nextAudio = new Audio(sound.path);
        nextAudio.loop = true;
        void nextAudio.play().catch(() => undefined);
        audioRefs.current[audioKey] = nextAudio;
      }

      setActiveSoundsByCharacter((previous) => {
        const current = previous[characterId] ?? [];
        if (current.includes(soundId)) {
          return previous;
        }
        return { ...previous, [characterId]: [...current, soundId] };
      });

      if (forceBump || characterId === activeCharacterId) {
        bumpGlowMeter(sound);
      }
    },
    [activeCharacterId, buildAudioKey, bumpGlowMeter, soundCatalogById],
  );

  const disableSound = useCallback(
    (characterId: string, soundId: string) => {
      const audioKey = buildAudioKey(characterId, soundId);
      const audio = audioRefs.current[audioKey];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        delete audioRefs.current[audioKey];
      }

      setActiveSoundsByCharacter((previous) => {
        const current = previous[characterId] ?? [];
        if (!current.includes(soundId)) {
          return previous;
        }
        const nextSounds = current.filter((id) => id !== soundId);
        return { ...previous, [characterId]: nextSounds };
      });
    },
    [buildAudioKey],
  );

  const toggleSound = useCallback(
    (soundId: string) => {
      if (!activeCharacterId) {
        return;
      }

      if (activeSoundIds.includes(soundId)) {
        disableSound(activeCharacterId, soundId);
        return;
      }

      enableSound(activeCharacterId, soundId);
    },
    [activeCharacterId, activeSoundIds, disableSound, enableSound],
  );

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, soundId: string) => {
    event.dataTransfer.setData('text/plain', soundId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (soundId: string) => {
    setTouchDraggedSound(soundId);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, characterId: string) => {
    event.preventDefault();
    setDropTargetId(null);
    const soundId = event.dataTransfer.getData('text/plain');
    if (!soundId) {
      return;
    }

    if (characterId !== activeCharacterId) {
      handleSelectCharacter(characterId);
      enableSound(characterId, soundId, true);
      return;
    }

    enableSound(characterId, soundId);
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (!touchDraggedSound) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = dropTarget?.closest('[data-character-id]') as HTMLElement | null;
    const targetId = target?.getAttribute('data-character-id') ?? null;
    setDropTargetId(targetId);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (!touchDraggedSound) {
      return;
    }

    const touch = event.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = dropTarget?.closest('[data-character-id]') as HTMLElement | null;
    const targetId = target?.getAttribute('data-character-id');

    if (targetId) {
      if (targetId !== activeCharacterId) {
        handleSelectCharacter(targetId);
        enableSound(targetId, touchDraggedSound, true);
      } else {
        enableSound(targetId, touchDraggedSound);
      }
    }

    setTouchDraggedSound(null);
    setDropTargetId(null);
  };

  const setCharacterScheme = useCallback((characterId: string, schemeIndex: number) => {
    setCharacterSchemeMap((previous) => {
      const next = { ...previous, [characterId]: schemeIndex };
      persistCharacterSchemeCookie(next);
      return next;
    });
  }, []);

  const handleSelectCharacter = useCallback(
    (characterId: string) => {
      if (characterId === activeCharacterId) {
        return;
      }

      setActiveCharacterId(characterId);
      setGlowMeter(0);
      setIsGlowBurst(false);
      setIsUltraMode(false);
      setComboWord(null);
      activeComboIdRef.current = null;
      lastTempoRef.current = null;
      stopCheerAudio();
    },
    [activeCharacterId, stopCheerAudio],
  );

  const handleCharacterImageLoad = useCallback((characterId: string) => {
    setLoadedCharacterMap((previous) => {
      if (previous[characterId]) {
        return previous;
      }
      return { ...previous, [characterId]: true };
    });
  }, []);

  const getDropTargetPulseClass = useCallback(
    (soundIds: string[]) => {
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
    },
    [soundCatalogById],
  );

  const resetBoard = useCallback(() => {
    stopAllAudio();
    stopCheerAudio();
    setTouchDraggedSound(null);
    setDropTargetId(null);
    setActiveSoundsByCharacter({});
    setGlowMeter(0);
    setIsGlowBurst(false);
    setIsUltraMode(false);
    lastTempoRef.current = null;
    activeComboIdRef.current = null;
    setComboWord(null);
    setVisibleSounds(getRandomSounds(ALL_SOUNDS, VISIBLE_SOUND_COUNT));
  }, [stopAllAudio, stopCheerAudio]);

  const toggleRenderMode = useCallback(() => {
    if (renderMode === 'glitch') {
      setRenderMode('stable');
      return;
    }

    setGlitchOverlayVars(createGlitchOverlayVars());
    setRenderMode('glitch');
  }, [renderMode]);

  useEffect(() => {
    if (!isBackgroundRotationReady || BACKGROUND_IMAGE_KEYS.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setBackgroundIndex((previous) => (previous + 1) % BACKGROUND_IMAGE_KEYS.length);
    }, 9000);

    return () => window.clearInterval(interval);
  }, [isBackgroundRotationReady]);

  useEffect(() => {
    const updateViewportType = () => {
      setIsMobileVerticalDevice(getIsMobileVerticalDevice());
    };

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
      preloadImage('/alise-1.png'),
      preloadImage('/gumi-1.png'),
      preloadImage('/hanako-1.png'),
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
      if (!isCancelled) {
        setIsBackgroundRotationReady(true);
      }
    };

    void preloadRemainingBackgrounds();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => () => stopAllAudio(), [stopAllAudio]);

  useEffect(() => {
    try {
      window.localStorage.setItem(GLITCH_PREF_KEY, renderMode);
    } catch {
      // Ignore localStorage failures and keep current runtime mode.
    }
  }, [renderMode]);

  useEffect(() => {
    if (activeSoundIds.length === 0) {
      lastTempoRef.current = null;
    }
  }, [activeSoundIds.length]);

  useEffect(() => {
    const activeSet = new Set(activeSoundIds);
    const matchedCombo = COMBO_WORDS.find((combo) => combo.soundIds.every((soundId) => activeSet.has(soundId)));

    if (!matchedCombo) {
      activeComboIdRef.current = null;
      return;
    }

    if (activeComboIdRef.current === matchedCombo.id) {
      return;
    }

    activeComboIdRef.current = matchedCombo.id;
    setComboWord(matchedCombo.word);
    if (comboTimeoutRef.current) {
      window.clearTimeout(comboTimeoutRef.current);
    }
    comboTimeoutRef.current = window.setTimeout(() => {
      setComboWord(null);
    }, 2200);
  }, [activeSoundIds]);

  useEffect(
    () => () => {
      if (comboTimeoutRef.current) {
        window.clearTimeout(comboTimeoutRef.current);
      }
      if (glowBurstTimeoutRef.current) {
        window.clearTimeout(glowBurstTimeoutRef.current);
      }
      if (ultraModeTimeoutRef.current) {
        window.clearTimeout(ultraModeTimeoutRef.current);
      }
      stopCheerAudio();
    },
    [stopCheerAudio],
  );

  const handleGlitchMenuAction = () => {
    toggleRenderMode();
    setIsMenuOpen(false);
  };

  return (
    <div className={`${styles.page} ${renderMode === 'glitch' ? styles.pageGlitch : ''}`} style={glitchOverlayVars}>
      <div className={styles.background} style={{ backgroundImage: `url(${activeBackgroundImage})` }} />
      <div className={styles.backgroundOverlay} />

      <main className={styles.content} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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

          <section className={styles.characterStage}>
            <div className={styles.characterStageLayout}>
              <div className={styles.characterControlDock}>
                <div className={styles.characterSelector} role="group" aria-label="Character selection">
                  {CHARACTERS.map((character) => {
                    const isActive = character.id === activeCharacterId;

                    return (
                      <button
                        key={character.id}
                        type="button"
                        className={`${styles.characterSelectButton} ${
                          isActive ? styles.characterSelectButtonActive : ''
                        }`}
                        onClick={() => handleSelectCharacter(character.id)}
                        aria-pressed={isActive}
                        aria-label={`Select ${character.name}`}
                        title={character.name}
                      >
                        <img className={styles.characterSelectIcon} src={character.img} alt="" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                {activeCharacter && (
                  <div
                    className={styles.characterSchemeList}
                    role="group"
                    aria-label={`${activeCharacter.name} color schemes`}
                  >
                    {activeCharacter.schemes.map((scheme, index) => {
                      const isActiveScheme = index === activeSchemeIndex;

                      return (
                        <button
                          key={`${activeCharacter.id}-${scheme.id}`}
                          type="button"
                          className={`${styles.characterSchemeButton} ${
                            isActiveScheme ? styles.characterSchemeButtonActive : ''
                          }`}
                          onClick={() => setCharacterScheme(activeCharacter.id, index)}
                          aria-pressed={isActiveScheme}
                          aria-label={`${activeCharacter.name} scheme: ${scheme.name}`}
                          title={scheme.name}
                          style={
                            {
                              '--scheme-primary': scheme.primaryColor,
                              '--scheme-secondary': scheme.secondaryColor,
                              '--scheme-soundboard': scheme.soundboardColor,
                            } as CSSProperties
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={styles.characterGrid}>
                {CHARACTERS.map((character) => {
                  const storedSchemeIndex = characterSchemeMap[character.id];
                  const schemeIndex =
                    typeof storedSchemeIndex === 'number' &&
                    Number.isInteger(storedSchemeIndex) &&
                    storedSchemeIndex >= 0 &&
                    storedSchemeIndex < character.schemes.length
                      ? storedSchemeIndex
                      : 0;
                  const scheme = character.schemes[schemeIndex] ?? character.schemes[0];
                  const characterSoundIds = activeSoundsByCharacter[character.id] ?? [];
                  const pulseClass = getDropTargetPulseClass(characterSoundIds);
                  const isActiveCharacter = character.id === activeCharacterId;
                  const isDropActive = dropTargetId === character.id;
                  const isImageLoaded = Boolean(loadedCharacterMap[character.id]);

                  return (
                    <div
                      key={character.id}
                      className={`${styles.dropTarget} ${pulseClass} ${
                        isDropActive ? styles.dropTargetActive : ''
                      } ${isActiveCharacter ? styles.dropTargetSelected : ''} ${
                        isGlowBurst && isActiveCharacter ? styles.dropTargetGlow : ''
                      }`}
                      data-character-id={character.id}
                      onClick={() => handleSelectCharacter(character.id)}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDropTargetId(character.id);
                      }}
                      onDragLeave={() => {
                        if (dropTargetId === character.id) {
                          setDropTargetId(null);
                        }
                      }}
                      onDrop={(event) => handleDrop(event, character.id)}
                      style={
                        {
                          '--character-title': scheme?.titleColor ?? character.titleColor,
                          '--character-primary': scheme?.primaryColor ?? character.primaryColor,
                          '--character-secondary': scheme?.secondaryColor ?? character.secondaryColor,
                          '--character-soundboard': scheme?.soundboardColor ?? character.soundboardColor,
                        } as CSSProperties
                      }
                    >
                      <p className={styles.dropLabel}>{character.mixLabel}</p>
                      {comboWord && isActiveCharacter && (
                        <div className={styles.comboWord} role="status" aria-live="polite">
                          {comboWord}
                        </div>
                      )}
                      <div className={styles.characterImageWrap}>
                        {!isImageLoaded && (
                          <img
                            className={styles.characterPlaceholder}
                            src={CHARACTER_PLACEHOLDER_PATH}
                            alt=""
                            aria-hidden="true"
                          />
                        )}
                        <img
                          className={`${styles.characterImage} ${!isImageLoaded ? styles.characterImageHidden : ''}`}
                          src={character.img}
                          alt={`${character.name} character`}
                          onLoad={() => handleCharacterImageLoad(character.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.gameRow}>
              <div
                className={`${styles.glowMeter} ${isUltraReady ? styles.glowMeterReady : ''}`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={glowPercent}
                aria-label="Glow meter"
              >
                <div className={styles.glowMeterFill} style={{ width: `${glowPercent}%` }} />
                <span className={styles.glowMeterLabel}>SYNC {glowPercent}%</span>
              </div>
              <button
                type="button"
                className={`${styles.ultraButton} ${isUltraReady ? styles.ultraButtonReady : ''} ${
                  isUltraMode ? styles.ultraButtonActive : ''
                }`}
                onClick={activateUltraMode}
                disabled={!isUltraReady || isUltraMode}
                aria-pressed={isUltraMode}
              >
                {ultraLabel}
              </button>
              {isCheerVisible && (
                <button
                  type="button"
                  className={`${styles.cheerButton} ${isCheerActive ? styles.cheerButtonActive : ''}`}
                  onClick={playCheer}
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
                  onClick={() => disableSound(activeCharacterId, soundId)}
                  aria-label={`Disable ${soundCatalogById.get(soundId)?.name ?? soundId}`}
                >
                  {soundCatalogById.get(soundId)?.name ?? soundId}
                </button>
              ))}
            </div>
          </section>

          <details className={styles.soundDropdown} open>
            <summary>Tap or Drag</summary>
            <p className={styles.dropdownHelper}>Tap to turn on, tap again to turn off!</p>
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
                    onDragStart={(event) => handleDragStart(event, sound.id)}
                    onTouchStart={() => handleTouchStart(sound.id)}
                    onClick={() => toggleSound(sound.id)}
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
        </section>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={resetBoard}
          aria-label="Reset all active sounds"
        >
          Reset & Change
        </button>

        <div className={styles.hamburgerWrap}>
          <button
            type="button"
            className={styles.hamburgerButton}
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
            aria-label="Open menu"
          >
            ☰
          </button>
          {isMenuOpen && (
            <div id="main-menu" className={styles.hamburgerMenu} role="menu" aria-label="Main menu">
              <button type="button" className={styles.hamburgerItem} onClick={handleGlitchMenuAction} role="menuitem">
                Glitch: {renderMode === 'glitch' ? 'Turn off' : 'Turn on'}
              </button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;
