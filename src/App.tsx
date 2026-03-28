import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, DragEvent, TouchEvent } from 'react';
import styles from './App.module.sass';
import CharacterGrid from './components/CharacterGrid';
import SoundPanel from './components/SoundPanel';
import EditCharacterModal from './components/EditCharacterModal';
import {
  ALL_SOUNDS,
  BACKGROUND_IMAGE_KEYS,
  CHARACTER_COLOR_TOKENS,
  CHARACTER_IMAGE_OPTIONS,
  CHARACTERS,
  type SoundOption,
} from './config';

const VISIBLE_SOUND_COUNT = 20;
const GLITCH_PREF_KEY = 'gumi-alise-glitch-mode';
const CHARACTER_CUSTOM_COOKIE = 'gumi-alise-character-custom';
const DEFAULT_GLITCH_MODE: 'stable' | 'glitch' = 'stable';
const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const BG_DESKTOP_SUFFIX = '1920';
const BG_MOBILE_SUFFIX = 'mob';
const GLOW_BURST_MS = 2200;
const ULTRA_MODE_MS = 10000;
const CHEER_DURATION_MS = 5000;
const MAX_SOUNDS_PER_CHARACTER = 3;
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

const CHEER_SOUND_PATHS = ['/hanako/applause.mp3', '/hanako/choir.mp3', '/hanako/laugh.mp3'] as const;

const CHARACTER_COLOR_OPTIONS = [
  { id: 'auto', label: 'Auto (Sound)', value: 'auto' },
  ...CHARACTER_COLOR_TOKENS.map((token, index) => ({
    id: `tokyo-${index + 1}`,
    label: `Tokyo ${index + 1}`,
    value: token,
  })),
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

type CharacterCustomization = {
  name?: string;
  colorMode?: 'auto' | string;
  image?: string;
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

const parseCharacterCustomCookie = (): CharacterCustomizationMap => {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CHARACTER_CUSTOM_COOKIE}=`));

  if (!cookieEntry) {
    return {};
  }

  const rawValue = cookieEntry.split('=').slice(1).join('=');

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
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
      if (typeof typed.colorMode === 'string') {
        next.colorMode = typed.colorMode;
      }
      if (typeof typed.image === 'string') {
        next.image = typed.image;
      }

      sanitized[key] = next;
    });

    return sanitized;
  } catch {
    return {};
  }
};

const persistCharacterCustomCookie = (customMap: CharacterCustomizationMap) => {
  if (typeof document === 'undefined') {
    return;
  }

  const encoded = encodeURIComponent(JSON.stringify(customMap));
  document.cookie = `${CHARACTER_CUSTOM_COOKIE}=${encoded}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

function App() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isMobileVerticalDevice, setIsMobileVerticalDevice] = useState(() => getIsMobileVerticalDevice());
  const [isBackgroundRotationReady, setIsBackgroundRotationReady] = useState(false);
  const [activeCharacterId, setActiveCharacterId] = useState(() => CHARACTERS[0]?.id ?? '');
  const [activeSoundsByCharacter, setActiveSoundsByCharacter] = useState<Record<string, string[]>>({});
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [loadedCharacterMap, setLoadedCharacterMap] = useState<Record<string, boolean>>({});
  const [characterCustomizations, setCharacterCustomizations] = useState<CharacterCustomizationMap>(() =>
    parseCharacterCustomCookie(),
  );
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
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
  const activeSoundIds = useMemo(
    () => (activeCharacter ? activeSoundsByCharacter[activeCharacter.id] ?? [] : []),
    [activeCharacter, activeSoundsByCharacter],
  );
  const soundCatalogById = useMemo(() => new Map(ALL_SOUNDS.map((sound) => [sound.id, sound] as const)), []);
  const activeCustomization = activeCharacter ? characterCustomizations[activeCharacter.id] ?? {} : {};
  const activeBaseScheme = activeCharacter?.schemes?.[0] ?? {
    titleColor: activeCharacter?.titleColor ?? 'white',
    primaryColor: activeCharacter?.primaryColor ?? '#600b87cc',
    secondaryColor: activeCharacter?.secondaryColor ?? '#ff0040a1',
    soundboardColor: activeCharacter?.soundboardColor ?? '#29063acc',
  };
  const activePanelColor = (() => {
    if (activeCustomization.colorMode && activeCustomization.colorMode !== 'auto') {
      return `var(${activeCustomization.colorMode})`;
    }

    if (activeCustomization.colorMode === 'auto' && activeSoundIds.length > 0) {
      const token = soundCatalogById.get(activeSoundIds[activeSoundIds.length - 1])?.colorToken;
      if (token) {
        return `var(${token})`;
      }
    }

    return activeBaseScheme.primaryColor;
  })();
  const activeScheme = {
    titleColor: activeBaseScheme.titleColor,
    primaryColor: activePanelColor,
    secondaryColor: activePanelColor,
    soundboardColor: activeBaseScheme.soundboardColor,
  };
  const totalActiveSounds = useMemo(
    () => Object.values(activeSoundsByCharacter).reduce((sum, ids) => sum + ids.length, 0),
    [activeSoundsByCharacter],
  );
  const glowPercent = Math.min(100, Math.round((totalActiveSounds / MAX_SOUNDS_TOTAL) * 100));
  const isUltraReady = totalActiveSounds >= MAX_SOUNDS_TOTAL;
  const ultraLabel = isUltraMode
    ? 'Ultra Active'
    : isUltraReady
      ? 'Ultra Ready'
      : `Ultra ${totalActiveSounds}/${MAX_SOUNDS_TOTAL}`;
  const isCheerVisible = activeSoundIds.length >= 3;
  const activeBackgroundSuffix = isMobileVerticalDevice ? BG_MOBILE_SUFFIX : BG_DESKTOP_SUFFIX;
  const activeBackgroundImage = useMemo(() => {
    const activeBackgroundKey = BACKGROUND_IMAGE_KEYS[backgroundIndex] ?? BACKGROUND_IMAGE_KEYS[0];
    return buildBackgroundImagePath(activeBackgroundKey, activeBackgroundSuffix);
  }, [activeBackgroundSuffix, backgroundIndex]);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const activeSoundOrderRef = useRef<Array<{ characterId: string; soundId: string }>>([]);
  const totalActiveSoundsRef = useRef(0);
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
    if (isUltraMode || totalActiveSounds < MAX_SOUNDS_TOTAL) {
      return;
    }

    if (ultraModeTimeoutRef.current) {
      window.clearTimeout(ultraModeTimeoutRef.current);
    }

    setIsUltraMode(true);
    ultraModeTimeoutRef.current = window.setTimeout(() => {
      setIsUltraMode(false);
    }, ULTRA_MODE_MS);
  }, [isUltraMode, totalActiveSounds]);

  const buildAudioKey = useCallback((characterId: string, soundId: string) => `${characterId}:${soundId}`, []);

  const enableSound = useCallback(
    (characterId: string, soundId: string) => {
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

        const next = { ...previous };
        let order = [...activeSoundOrderRef.current];

        const removeEntry = (removeCharacterId: string, removeSoundId: string) => {
          const removeKey = buildAudioKey(removeCharacterId, removeSoundId);
          const removeAudio = audioRefs.current[removeKey];
          if (removeAudio) {
            removeAudio.pause();
            removeAudio.currentTime = 0;
            delete audioRefs.current[removeKey];
          }

          const list = next[removeCharacterId] ?? [];
          if (list.includes(removeSoundId)) {
            const updatedList = list.filter((id) => id !== removeSoundId);
            if (updatedList.length > 0) {
              next[removeCharacterId] = updatedList;
            } else {
              delete next[removeCharacterId];
            }
          }

          order = order.filter(
            (entry) => !(entry.characterId === removeCharacterId && entry.soundId === removeSoundId),
          );
        };

        while (order.length >= MAX_SOUNDS_TOTAL) {
          const oldest = order[0];
          if (!oldest) {
            break;
          }
          removeEntry(oldest.characterId, oldest.soundId);
        }

        const updatedCurrent = next[characterId] ?? [];
        if (updatedCurrent.length >= MAX_SOUNDS_PER_CHARACTER) {
          removeEntry(characterId, updatedCurrent[0]);
        }

        next[characterId] = [...(next[characterId] ?? []), soundId];
        order.push({ characterId, soundId });
        activeSoundOrderRef.current = order;
        return next;
      });
    },
    [buildAudioKey, soundCatalogById],
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

      activeSoundOrderRef.current = activeSoundOrderRef.current.filter(
        (entry) => !(entry.characterId === characterId && entry.soundId === soundId),
      );
    },
    [buildAudioKey],
  );

  const resetCharacter = useCallback(
    (characterId: string) => {
      setActiveSoundsByCharacter((previous) => {
        const current = previous[characterId] ?? [];
        if (current.length === 0) {
          return previous;
        }

        current.forEach((soundId) => {
          const audioKey = buildAudioKey(characterId, soundId);
          const audio = audioRefs.current[audioKey];
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
            delete audioRefs.current[audioKey];
          }
        });

        return { ...previous, [characterId]: [] };
      });

      activeSoundOrderRef.current = activeSoundOrderRef.current.filter(
        (entry) => entry.characterId !== characterId,
      );

      if (characterId === activeCharacterId) {
        activeComboIdRef.current = null;
        setComboWord(null);
      }
    },
    [activeCharacterId, buildAudioKey],
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
      enableSound(characterId, soundId);
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
        enableSound(targetId, touchDraggedSound);
      } else {
        enableSound(targetId, touchDraggedSound);
      }
    }

    setTouchDraggedSound(null);
    setDropTargetId(null);
  };

  const updateCharacterCustomization = useCallback((characterId: string, patch: CharacterCustomization) => {
    setCharacterCustomizations((previous) => {
      const current = previous[characterId] ?? {};
      const next = { ...previous, [characterId]: { ...current, ...patch } };
      persistCharacterCustomCookie(next);
      return next;
    });
  }, []);

  const handleSelectCharacter = useCallback(
    (characterId: string) => {
      if (characterId === activeCharacterId) {
        return;
      }

      setActiveCharacterId(characterId);
      setIsGlowBurst(false);
      setIsUltraMode(false);
      setComboWord(null);
      activeComboIdRef.current = null;
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

  const resetBoard = useCallback(() => {
    stopAllAudio();
    stopCheerAudio();
    setTouchDraggedSound(null);
    setDropTargetId(null);
    setActiveSoundsByCharacter({});
    setIsGlowBurst(false);
    setIsUltraMode(false);
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
    if (totalActiveSounds >= MAX_SOUNDS_TOTAL && totalActiveSoundsRef.current < MAX_SOUNDS_TOTAL) {
      triggerGlowBurst();
    }
    totalActiveSoundsRef.current = totalActiveSounds;
  }, [totalActiveSounds, triggerGlowBurst]);

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

          <CharacterGrid
            characters={CHARACTERS}
            activeCharacterId={activeCharacterId}
            customizations={characterCustomizations}
            activeSoundsByCharacter={activeSoundsByCharacter}
            soundCatalogById={soundCatalogById}
            dropTargetId={dropTargetId}
            loadedCharacterMap={loadedCharacterMap}
            isGlowBurst={isGlowBurst}
            comboWord={comboWord}
            onSelectCharacter={handleSelectCharacter}
            onDragOverCharacter={(_, characterId) => setDropTargetId(characterId)}
            onDragLeaveCharacter={(characterId) => {
              if (dropTargetId === characterId) {
                setDropTargetId(null);
              }
            }}
            onDropSound={(event, characterId) => handleDrop(event, characterId)}
            onImageLoad={handleCharacterImageLoad}
            onEditCharacter={(characterId) =>
              setEditingCharacterId((previous) => (previous === characterId ? null : characterId))
            }
            onResetCharacter={resetCharacter}
          />

          <SoundPanel
            activeSoundIds={activeSoundIds}
            totalActiveSounds={totalActiveSounds}
            maxSoundsTotal={MAX_SOUNDS_TOTAL}
            soundCatalogById={soundCatalogById}
            visibleSounds={visibleSounds}
            isUltraReady={isUltraReady}
            isUltraMode={isUltraMode}
            ultraLabel={ultraLabel}
            glowPercent={glowPercent}
            isCheerVisible={isCheerVisible}
            isCheerActive={isCheerActive}
            onActivateUltra={activateUltraMode}
            onPlayCheer={playCheer}
            onDisableSound={(soundId) => disableSound(activeCharacterId, soundId)}
            onToggleSound={toggleSound}
            onDragStart={handleDragStart}
            onTouchStart={handleTouchStart}
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
          onClose={() => setEditingCharacterId(null)}
          onSelectCharacter={(id) => setEditingCharacterId(id)}
          onUpdateCustomization={(id, patch) => {
            updateCharacterCustomization(id, patch);
          }}
        />

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
