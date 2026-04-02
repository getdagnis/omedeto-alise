import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowsRotate,
  faPen,
  faThumbtack,
  faTrash,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import styles from './App.module.sass';
import CharacterGrid from './components/CharacterGrid';
import EditCharacterModal from './components/EditCharacterModal';
import ProgressionMeter from './components/ProgressionMeter';
import { Menu } from './components/Menu/Menu';
import Shop from './components/Shop/Shop';
import Admin from './components/Admin/Admin';
import SandboxUI from './screens/SandboxUI';
import { useProgression } from './hooks/useProgression';
import { PROGRESSION_LEVELS } from './progression';
import { Button, CloseButton, ProgressCircle } from './components-ui';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import {
  ALL_SOUNDS,
  BACKGROUND_IMAGE_KEYS,
  CHARACTER_COLOR_TOKENS,
  CHARACTER_IMAGE_OPTIONS,
  CHARACTERS,
  LOCALIZATIONS,
} from './config';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const BG_DESKTOP_SUFFIX = '1920';
const BG_MOBILE_SUFFIX = 'mob';
const GLOW_BURST_MS = 2200;
const MAX_SOUNDS_TOTAL = 12;
const LOW_GRAPHICS_STORAGE_KEY = 'gumi-alise-low-graphics';
const MAX_CHARACTER_SOUNDS = 9;
const PICKER_RANDOM_DELAY_MS = 420;

type PickerRandomBusy = { kind: 'slot'; index: number } | { kind: 'shuffle' };

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
const getRandomUnusedSoundId = (allIds: string[], excludedIds: string[]) => {
  const blocked = new Set(excludedIds);
  const options = allIds.filter((id) => !blocked.has(id));
  return options.sort(() => 0.5 - Math.random())[0] ?? null;
};

const getIsMobileVerticalDevice = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  return isPortrait && hasCoarsePointer;
};

const getStoredLowGraphicsMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(LOW_GRAPHICS_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
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
        next.soundIds = typed.soundIds.filter((s) => typeof s === 'string').slice(0, MAX_CHARACTER_SOUNDS);
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
  const [isLowGraphics, setIsLowGraphics] = useState(() => getStoredLowGraphicsMode());

  const [favoriteCharacterId, setFavoriteCharacterId] = useState<string>(() => '');

  const [activeSoundsByCharacter, setActiveSoundsByCharacter] = useState<Record<string, string[]>>({});
  const [loadedCharacterMap, setLoadedCharacterMap] = useState<Record<string, boolean>>({});
  const [characterCustomizations, setCharacterCustomizations] = useState<CharacterCustomizationMap>(() =>
    parseCharacterCustomStorage(),
  );
  const [mutedCharacterIds, setMutedCharacterIds] = useState<Set<string>>(new Set());
  const [pickingSoundsCharacterId, setPickingSoundsCharacterId] = useState<string | null>(null);
  const [pickerSlots, setPickerSlots] = useState<Array<string | null>>([]);
  const [pickerSelectedSoundIds, setPickerSelectedSoundIds] = useState<string[]>([]);
  const [pickerPinnedSoundIds, setPickerPinnedSoundIds] = useState<string[]>([]);
  const [pickerRandomBusy, setPickerRandomBusy] = useState<PickerRandomBusy | null>(null);
  const [initialEditTab, setInitialEditTab] = useState<'colors' | 'sounds'>('colors');
  const editingCharacterId = useMemo(() => {
    const match = currentPath.match(/^\/(.+)\/edit$/);
    if (match) return match[1];
    return null;
  }, [currentPath]);
  const isShopOpen = currentPath === '/shop';
  const isAdminOpen = currentPath === '/admin';
  const isSandboxUIOpen = currentPath === '/sandbox';
  const isInternalRoute = isAdminOpen || isSandboxUIOpen;

  const [isGlowBurst, setIsGlowBurst] = useState(false);
  const [comboWord, setComboWord] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const savedScrollPositionRef = useRef<number>(0);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingSoundId, setPreviewingSoundId] = useState<string | null>(null);
  const [pickerActionSoundId, setPickerActionSoundId] = useState<string | null>(null);
  const pickerActionTimeoutRef = useRef<number | null>(null);

  const soundCatalogById = useMemo(() => new Map(ALL_SOUNDS.map((sound) => [sound.id, sound] as const)), []);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const activeSoundOrderRef = useRef<Array<{ characterId: string; soundId: string }>>([]);
  const totalActiveSoundsRef = useRef(0);
  const glowBurstTimeoutRef = useRef<number | null>(null);
  const activeComboIdRef = useRef<string | null>(null);
  const pickerShuffleTimeoutRef = useRef<number | null>(null);
  const pickerSlotsLatestRef = useRef<Array<string | null>>([]);
  const pickerPinnedLatestRef = useRef<string[]>([]);

  useEffect(() => {
    pickerSlotsLatestRef.current = pickerSlots;
  }, [pickerSlots]);

  useEffect(() => {
    pickerPinnedLatestRef.current = pickerPinnedSoundIds;
  }, [pickerPinnedSoundIds]);

  const {
    state: progressionState,
    currentLevelInfo,
    nextLevelInfo,
    recordSoundPlayed,
    recordCharacterCustomized,
    buySound,
  } = useProgression();

  // User-visible lvl 2 = progression level 1 (Dual Boost / 2 sounds per character).
  const [isLvl2AchievementOpen, setIsLvl2AchievementOpen] = useState(false);
  const lastUnlockedLevelRef = useRef<number>(progressionState.unlockedLevel);

  useEffect(() => {
    const prev = lastUnlockedLevelRef.current;
    const next = progressionState.unlockedLevel;

    if (!isLvl2AchievementOpen && prev < 1 && next === 1) {
      // Schedule outside the effect body to avoid cascading renders.
      window.setTimeout(() => setIsLvl2AchievementOpen(true), 0);
    }

    lastUnlockedLevelRef.current = next;
  }, [progressionState.unlockedLevel, isLvl2AchievementOpen]);

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
        setTimeout(() => {
          setPreviewingSoundId(null);
        }, 0);
      }
    };
  }, [currentPath]);

  useEffect(() => {
    if (!pickingSoundsCharacterId && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setTimeout(() => {
        setPreviewingSoundId(null);
      }, 0);
    }
  }, [pickingSoundsCharacterId]);

  const clearPreviewAudio = useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
  }, []);

  const stopPickerPreview = useCallback((soundId: string) => {
    if (pickerActionTimeoutRef.current) {
      window.clearTimeout(pickerActionTimeoutRef.current);
      pickerActionTimeoutRef.current = null;
    }
    clearPreviewAudio();
    setPreviewingSoundId(null);
    setPickerActionSoundId(soundId);
    pickerActionTimeoutRef.current = window.setTimeout(() => {
      setPickerActionSoundId((current) => (current === soundId ? null : current));
      pickerActionTimeoutRef.current = null;
    }, 2000);
  }, [clearPreviewAudio]);

  const startPickerPreview = useCallback(
    (soundId: string, path: string) => {
      if (pickerActionTimeoutRef.current) {
        window.clearTimeout(pickerActionTimeoutRef.current);
        pickerActionTimeoutRef.current = null;
      }
      clearPreviewAudio();

      const audio = new Audio(path);
      audio.loop = false;
      audio.onended = () => {
        setPreviewingSoundId(null);
        setPickerActionSoundId(soundId);
        if (pickerActionTimeoutRef.current) {
          window.clearTimeout(pickerActionTimeoutRef.current);
        }
        pickerActionTimeoutRef.current = window.setTimeout(() => {
          setPickerActionSoundId((current) => (current === soundId ? null : current));
          pickerActionTimeoutRef.current = null;
        }, 2000);
      };
      void audio.play().catch(() => undefined);
      previewAudioRef.current = audio;
      setPreviewingSoundId(soundId);
      setPickerActionSoundId(soundId);
    },
    [clearPreviewAudio],
  );

  const togglePreviewSound = useCallback(
    (soundId: string, path: string) => {
      if (previewingSoundId === soundId) {
        stopPickerPreview(soundId);
        return;
      }

      startPickerPreview(soundId, path);
      setPickerSelectedSoundIds((previous) => {
        if (previous.includes(soundId)) {
          return previous;
        }
        if (previous.length >= currentLevelInfo.soundsPerCharacter) {
          return [...previous.slice(1), soundId];
        }
        return [...previous, soundId];
      });
    },
    [currentLevelInfo.soundsPerCharacter, previewingSoundId, startPickerPreview, stopPickerPreview],
  );

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
          (e) => !(e.characterId === characterId && e.soundId === soundId),
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
              (e) => !(e.characterId === characterId && e.soundId === oldestSoundId),
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
    [
      buildAudioKey,
      soundCatalogById,
      unmuteCharacter,
      recordSoundPlayed,
      currentLevelInfo.soundsPerCharacter,
      activeSoundsByCharacter,
    ],
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
    document.documentElement.dataset.graphics = isLowGraphics ? 'low' : 'full';

    try {
      window.localStorage.setItem(LOW_GRAPHICS_STORAGE_KEY, String(isLowGraphics));
    } catch {
      // Ignore storage errors.
    }

    return () => {
      delete document.documentElement.dataset.graphics;
    };
  }, [isLowGraphics]);

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

  const handleRemoveSound = useCallback((soundId: string) => {
    setPickerSlots((previous) => previous.map((id) => (id === soundId ? null : id)));
    setPickerSelectedSoundIds((previous) => previous.filter((id) => id !== soundId));
    setPickerPinnedSoundIds((previous) => previous.filter((id) => id !== soundId));
    setPickerActionSoundId((current) => (current === soundId ? null : current));
  }, []);

  const clearPickerShuffleTimer = useCallback(() => {
    if (pickerShuffleTimeoutRef.current !== null) {
      window.clearTimeout(pickerShuffleTimeoutRef.current);
      pickerShuffleTimeoutRef.current = null;
    }
  }, []);

  const applyPickerSlotRandom = useCallback((characterId: string, slotIndex: number) => {
    const character = CHARACTERS.find((entry) => entry.id === characterId);
    if (!character) {
      return;
    }

    const allSoundIds = character.sounds.map((sound) => sound.id);
    setPickerSlots((previous) => {
      const slots = Array.from({ length: MAX_CHARACTER_SOUNDS }, (_, index) => previous[index] ?? null);
      const nextSoundId = getRandomUnusedSoundId(
        allSoundIds,
        slots.filter((id): id is string => Boolean(id)),
      );

      if (!nextSoundId) {
        return previous;
      }

      const nextSlots = [...slots];
      nextSlots[slotIndex] = nextSoundId;
      return nextSlots;
    });
  }, []);

  const schedulePickerSlotRandom = useCallback(
    (characterId: string, slotIndex: number) => {
      if (pickerRandomBusy !== null) {
        return;
      }

      const character = CHARACTERS.find((entry) => entry.id === characterId);
      if (!character) {
        return;
      }

      const slots = Array.from({ length: MAX_CHARACTER_SOUNDS }, (_, index) => pickerSlotsLatestRef.current[index] ?? null);
      const nextSoundId = getRandomUnusedSoundId(
        character.sounds.map((sound) => sound.id),
        slots.filter((id): id is string => Boolean(id)),
      );

      if (!nextSoundId) {
        return;
      }

      clearPickerShuffleTimer();
      setPickerRandomBusy({ kind: 'slot', index: slotIndex });
      pickerShuffleTimeoutRef.current = window.setTimeout(() => {
        pickerShuffleTimeoutRef.current = null;
        applyPickerSlotRandom(characterId, slotIndex);
        setPickerRandomBusy(null);
      }, PICKER_RANDOM_DELAY_MS);
    },
    [applyPickerSlotRandom, clearPickerShuffleTimer, pickerRandomBusy],
  );

  const applyPickerShuffleAll = useCallback((characterId: string) => {
    const character = CHARACTERS.find((c) => c.id === characterId);
    if (!character) return;

    const allSoundIds = character.sounds.map((s) => s.id);
    const pickerSlotsSnapshot = pickerSlotsLatestRef.current;
    const pickerPinnedSnapshot = pickerPinnedLatestRef.current;
    const pinned = new Set(pickerPinnedSnapshot);
    const used = new Set<string>();
    const nextSlots = Array.from({ length: MAX_CHARACTER_SOUNDS }, (_, index) => {
      const currentId = pickerSlotsSnapshot[index] ?? null;
      if (currentId && pinned.has(currentId)) {
        used.add(currentId);
        return currentId;
      }
      const nextId = getRandomUnusedSoundId(allSoundIds, [...used]);
      if (nextId) {
        used.add(nextId);
      }
      return nextId;
    });

    setPickerSlots(nextSlots);
    setPickerSelectedSoundIds((previous) => previous.filter((id) => nextSlots.includes(id)));
    setPickerActionSoundId(null);
  }, []);

  const schedulePickerShuffleAll = useCallback(
    (characterId: string) => {
      if (pickerRandomBusy !== null) {
        return;
      }

      clearPickerShuffleTimer();
      setPickerRandomBusy({ kind: 'shuffle' });
      pickerShuffleTimeoutRef.current = window.setTimeout(() => {
        pickerShuffleTimeoutRef.current = null;
        applyPickerShuffleAll(characterId);
        setPickerRandomBusy(null);
      }, PICKER_RANDOM_DELAY_MS);
    },
    [applyPickerShuffleAll, clearPickerShuffleTimer, pickerRandomBusy],
  );

  const togglePickerSelectedSound = useCallback(
    (soundId: string) => {
      setPickerSelectedSoundIds((previous) => {
        if (previous.includes(soundId)) {
          return previous.filter((id) => id !== soundId);
        }
        if (previous.length >= currentLevelInfo.soundsPerCharacter) {
          return [...previous.slice(1), soundId];
        }
        return [...previous, soundId];
      });
    },
    [currentLevelInfo.soundsPerCharacter],
  );

  const onPickerSoundBarPress = useCallback(
    (soundId: string, path: string) => {
      const wasSelected = pickerSelectedSoundIds.includes(soundId);
      togglePickerSelectedSound(soundId);
      if (!wasSelected) {
        startPickerPreview(soundId, path);
      } else if (previewingSoundId === soundId) {
        stopPickerPreview(soundId);
      }
    },
    [pickerSelectedSoundIds, previewingSoundId, startPickerPreview, stopPickerPreview, togglePickerSelectedSound],
  );

  const togglePickerPinnedSound = useCallback((soundId: string) => {
    setPickerPinnedSoundIds((previous) =>
      previous.includes(soundId) ? previous.filter((id) => id !== soundId) : [...previous, soundId],
    );
  }, []);

  const closeSoundPicker = useCallback(() => {
    if (pickerActionTimeoutRef.current) {
      window.clearTimeout(pickerActionTimeoutRef.current);
      pickerActionTimeoutRef.current = null;
    }
    if (pickerShuffleTimeoutRef.current !== null) {
      window.clearTimeout(pickerShuffleTimeoutRef.current);
      pickerShuffleTimeoutRef.current = null;
    }
    setPickerRandomBusy(null);
    setPickerSlots([]);
    setPickerSelectedSoundIds([]);
    setPickerPinnedSoundIds([]);
    setPickerActionSoundId(null);
    setPickingSoundsCharacterId(null);
  }, []);

  const applyPickerSelection = useCallback(
    (characterId: string) => {
      const nextSlots = pickerSlots.filter((id): id is string => Boolean(id));
      const nextSelected = nextSlots.filter((id) => pickerSelectedSoundIds.includes(id));
      if (nextSelected.length === 0) {
        return;
      }

      updateCharacterCustomization(characterId, { soundIds: nextSlots });
      unmuteCharacter(characterId);

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
      activeSoundOrderRef.current = activeSoundOrderRef.current.filter((entry) => entry.characterId !== characterId);

      nextSelected.forEach((soundId) => {
        const sound = soundCatalogById.get(soundId);
        if (!sound) return;
        const audioKey = buildAudioKey(characterId, soundId);
        const audio = new Audio(sound.path);
        audio.loop = true;
        audio.volume = 1;
        void audio.play().catch(() => undefined);
        audioRefs.current[audioKey] = audio;
        activeSoundOrderRef.current.push({ characterId, soundId });
        recordSoundPlayed(characterId, soundId);
      });

      setActiveSoundsByCharacter((previous) => ({
        ...previous,
        [characterId]: nextSelected,
      }));

      if (currentLevelInfo.soundsPerCharacter === 1) {
        closeSoundPicker();
      }
    },
    [
      activeSoundsByCharacter,
      buildAudioKey,
      closeSoundPicker,
      currentLevelInfo.soundsPerCharacter,
      pickerSelectedSoundIds,
      pickerSlots,
      recordSoundPlayed,
      soundCatalogById,
      unmuteCharacter,
      updateCharacterCustomization,
    ],
  );

  const openSoundPicker = useCallback(
    (characterId: string) => {
      const currentSoundIds = characterCustomizations[characterId]?.soundIds ?? [];
      const currentSelected = activeSoundsByCharacter[characterId] ?? [];
      if (pickerShuffleTimeoutRef.current !== null) {
        window.clearTimeout(pickerShuffleTimeoutRef.current);
        pickerShuffleTimeoutRef.current = null;
      }
      setPickerRandomBusy(null);
      setPickerSlots([
        ...currentSoundIds.slice(0, MAX_CHARACTER_SOUNDS),
        ...Array.from({ length: Math.max(0, MAX_CHARACTER_SOUNDS - currentSoundIds.length) }, () => null),
      ]);
      setPickerSelectedSoundIds(currentSelected);
      setPickerPinnedSoundIds([]);
      setPickerActionSoundId(null);
      setPickingSoundsCharacterId(characterId);
    },
    [activeSoundsByCharacter, characterCustomizations],
  );

  const openCharacterSoundCollection = useCallback(
    (characterId: string) => {
      setInitialEditTab('sounds');
      closeSoundPicker();
      navigate(`/${characterId}/edit`);
    },
    [closeSoundPicker, navigate],
  );

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
  const isBlockingOverlayOpen = Boolean(editingCharacterId || pickingSoundsCharacterId);
  const isMenuVisible = isMenuOpen && !isInternalRoute;

  const lvl2NextLevel = PROGRESSION_LEVELS[2];
  const lvl2NextReq = lvl2NextLevel.requirements;
  const lvl2UnlockNextLines = [
    lvl2NextReq.charactersCustomized
      ? `Customize images/colors on ${lvl2NextReq.charactersCustomized} characters.`
      : null,
    lvl2NextReq.minutesPlayed ? `Mix for ${lvl2NextReq.minutesPlayed} minutes.` : null,
    lvl2NextReq.soundsPlayed ? `Trigger ${lvl2NextReq.soundsPlayed} different sound clips.` : null,
  ].filter((line): line is string => Boolean(line));

  return (
    <div className={`${styles.page} ${isLowGraphics ? styles.pageLowGraphics : ''}`}>
      <div className={styles.background} style={{ backgroundImage: `url(${activeBackgroundImage})` }} />
      <div className={styles.backgroundOverlay} />

      <main className={styles.content}>
        {isInternalRoute ? (
          <section className={styles.internalPage}>
            <header className={styles.internalPageHeader}>
              <Button
                variant="secondary"
                size="sm"
                shape="pill"
                className={styles.internalBackButton}
                onPress={() => navigate('/')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
            </header>

            <div className={styles.internalPageBody}>
              {isAdminOpen && <Admin onPreviewSound={togglePreviewSound} previewingSoundId={previewingSoundId} />}
              {isSandboxUIOpen && <SandboxUI />}
            </div>
          </section>
        ) : (
          <>
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
                onDropSound={(event: React.DragEvent<HTMLDivElement>, characterId: string) => {
                  event.preventDefault();
                  const soundId = event.dataTransfer.getData('text/plain');
                  if (soundId) setSingleSound(characterId, soundId);
                }}
                onImageLoad={handleCharacterImageLoad}
                onEditCharacter={(characterId: string) => {
                  setInitialEditTab('colors');
                  navigate(`/${characterId}/edit`);
                }}
                onResetCharacter={resetCharacter}
                onOpenSoundPicker={openSoundPicker}
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
              ownedSoundIds={progressionState.ownedSoundIds}
              initialTab={initialEditTab}
              unlockedLevel={progressionState.unlockedLevel}
              onClose={() => navigate('/')}
              onSelectCharacter={(id: string) => navigate(`/${id}/edit`)}
              onUpdateCustomization={(id: string, patch: CharacterCustomization) =>
                updateCharacterCustomization(id, patch)
              }
              onOpenShop={() => navigate('/shop')}
            />

            <Shop
              isOpen={isShopOpen}
              onClose={() => navigate('/')}
              walletBalance={progressionState.walletBalance}
              currencySymbol={LOCALIZATIONS.currencySymbol}
              ownedSoundIds={progressionState.ownedSoundIds}
              onBuySound={buySound}
              onPreviewSound={togglePreviewSound}
              previewingSoundId={previewingSoundId}
            />

            {pickingSoundsCharacterId && (
              <>
                <div className={styles.backdrop} onClick={closeSoundPicker} />
                <div className={styles.pickerOverlay} role="dialog" aria-modal="true" aria-label="Add sound">
                  <div className={styles.pickerCard}>
                    <header className={styles.pickerHeader}>
                      <div className={styles.pickerHeaderLeft}>
                        <h3 className={styles.pickerTitle}>SOUND PICKER</h3>
                        <Button
                          type="button"
                          variant="quiet"
                          size="sm"
                          shape="square"
                          className={styles.editSoundsButton}
                          onPress={() => {
                            setInitialEditTab('sounds');
                            const charId = pickingSoundsCharacterId;
                            closeSoundPicker();
                            navigate(`/${charId}/edit`);
                          }}
                          aria-label="Edit sounds"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                      </div>
                      <CloseButton
                        className={styles.closeButton}
                        onPress={closeSoundPicker}
                        aria-label="Close sound selector"
                      />
                    </header>
                    <div className={styles.pickerContent}>
                      {(() => {
                        const characterId = pickingSoundsCharacterId;
                        if (!characterId) return null;
                        const character = CHARACTERS.find((entry) => entry.id === characterId);
                        if (!character) return null;
                        const characterName = characterCustomizations[characterId]?.name?.trim() || character.name;
                        const pickerSpinnerSize = 18;
                        const isPickerRandomBusy = pickerRandomBusy !== null;
                        const slotSpinnerIndex = pickerRandomBusy?.kind === 'slot' ? pickerRandomBusy.index : null;

                        const availableSounds = pickerSlots
                          .filter((id): id is string => Boolean(id))
                          .map((id) => soundCatalogById.get(id))
                          .filter((s): s is NonNullable<typeof s> => Boolean(s));
                        const visibleSlots = Array.from({ length: MAX_CHARACTER_SOUNDS }, (_, index) => {
                          const soundId = pickerSlots[index];
                          return soundId ? (soundCatalogById.get(soundId) ?? null) : null;
                        });

                        return (
                          <div className={styles.pickerSections}>
                            <section className={styles.pickerLibrary}>
                              <div className={styles.pickerLibraryHeader}>
                                <div>
                                  <p className={styles.pickerSectionEyebrow}>This Character's Mix</p>
                                  <h4 className={styles.pickerSectionTitle}>
                                    Choose up to {MAX_CHARACTER_SOUNDS} sounds
                                  </h4>
                                </div>
                                <span className={styles.pickerLibraryCount}>
                                  {availableSounds.length}/{MAX_CHARACTER_SOUNDS}
                                </span>
                              </div>

                              <div className={styles.pickerOptionActions}>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  shape="default"
                                  className={styles.emptyPickerButton}
                                  onPress={() => openCharacterSoundCollection(characterId)}
                                >
                                  YOUR COLLECTION
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  shape="default"
                                  className={styles.emptyPickerButton}
                                  onPress={() => {
                                    closeSoundPicker();
                                    navigate('/shop');
                                  }}
                                >
                                  SHOP FOR SOUNDS
                                </Button>
                                <Button
                                  type="button"
                                  variant="primary"
                                  size="sm"
                                  shape="default"
                                  className={`${styles.emptyPickerButton} ${styles.pickerButtonCallout}`}
                                  onPress={() => schedulePickerShuffleAll(characterId)}
                                  isDisabled={isPickerRandomBusy}
                                >
                                  {pickerRandomBusy?.kind === 'shuffle' ? (
                                    <span className={styles.pickerShuffleButtonInner}>
                                      <ProgressCircle
                                        aria-label="Shuffling"
                                        isIndeterminate
                                        value={0}
                                        size={pickerSpinnerSize}
                                      />
                                      <span>SHUFFLE SOUNDS</span>
                                    </span>
                                  ) : (
                                    'SHUFFLE SOUNDS'
                                  )}
                                </Button>
                              </div>

                              <div className={styles.pickerList}>
                                {visibleSlots.map((sound, index) => {
                                  if (!sound) {
                                    return (
                                      <div
                                        key={`empty-slot-${index}`}
                                        className={`${styles.pickerItemWrap} ${styles.pickerItemWrapEmpty}`}
                                      >
                                        <div
                                          className={`${styles.pickerItemPreview} ${styles.pickerItemPreviewEmpty}`}
                                          aria-hidden="true"
                                        />
                                        <button
                                          type="button"
                                          className={`${styles.pickerItemSelect} ${styles.pickerItemSelectEmpty}`}
                                          onClick={() => schedulePickerSlotRandom(characterId, index)}
                                          disabled={isPickerRandomBusy}
                                          aria-label="Add random sound"
                                          aria-busy={slotSpinnerIndex === index}
                                        >
                                          {slotSpinnerIndex === index ? (
                                            <ProgressCircle aria-hidden isIndeterminate value={0} size={pickerSpinnerSize} />
                                          ) : (
                                            <FontAwesomeIcon icon={faArrowsRotate} />
                                          )}
                                        </button>
                                      </div>
                                    );
                                  }

                                  const isSelected = pickerSelectedSoundIds.includes(sound.id);
                                  const isPinned = pickerPinnedSoundIds.includes(sound.id);
                                  const isPreviewing = previewingSoundId === sound.id;
                                  const isActionActive = pickerActionSoundId === sound.id;
                                  const showFullActions = isSelected || isActionActive;
                                  const showPinOnly = !showFullActions && (isPinned || isActionActive);

                                  return (
                                    <div
                                      key={sound.id}
                                      className={`${styles.pickerItemWrap} ${isSelected ? styles.pickerItemActive : ''} ${
                                        isPreviewing ? styles.pickerItemWrapPreviewing : ''
                                      }`}
                                      style={{ '--sound-color': `var(${sound.colorToken})` } as CSSProperties}
                                    >
                                      <button
                                        type="button"
                                        className={`${styles.pickerItemPreview} ${isPreviewing ? styles.pickerItemPreviewing : ''}`}
                                        onClick={() => togglePreviewSound(sound.id, sound.path)}
                                        aria-label={isPreviewing ? 'Stop preview' : 'Preview sound'}
                                      >
                                        <FontAwesomeIcon icon={faVolumeHigh} />
                                      </button>
                                    <button
                                      type="button"
                                      className={styles.pickerItemSelect}
                                      onClick={() => onPickerSoundBarPress(sound.id, sound.path)}
                                    >
                                      <span>{sound.name.toUpperCase()}</span>
                                    </button>
                                      {showFullActions && (
                                        <>
                                          <button
                                            type="button"
                                            className={styles.pickerItemDelete}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveSound(sound.id);
                                            }}
                                            aria-label="Remove sound"
                                          >
                                            <FontAwesomeIcon icon={faTrash} />
                                          </button>
                                          <button
                                            type="button"
                                            className={styles.pickerItemRefresh}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              schedulePickerSlotRandom(characterId, index);
                                            }}
                                            disabled={isPickerRandomBusy}
                                            aria-label="Replace with random sound"
                                            aria-busy={slotSpinnerIndex === index}
                                          >
                                            {slotSpinnerIndex === index ? (
                                              <ProgressCircle aria-hidden isIndeterminate value={0} size={pickerSpinnerSize} />
                                            ) : (
                                              <FontAwesomeIcon icon={faArrowsRotate} />
                                            )}
                                          </button>
                                          <button
                                            type="button"
                                            className={`${styles.pickerItemPin} ${isPinned ? styles.pickerItemPinActive : ''}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              togglePickerPinnedSound(sound.id);
                                            }}
                                            aria-label={isPinned ? 'Unpin sound' : 'Pin sound'}
                                            aria-pressed={isPinned}
                                          >
                                            <FontAwesomeIcon icon={faThumbtack} />
                                          </button>
                                        </>
                                      )}
                                      {!showFullActions && showPinOnly && (
                                        <button
                                          type="button"
                                          className={`${styles.pickerItemPin} ${isPinned ? styles.pickerItemPinActive : ''}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePickerPinnedSound(sound.id);
                                          }}
                                          aria-label={isPinned ? 'Unpin sound' : 'Pin sound'}
                                          aria-pressed={isPinned}
                                        >
                                          <FontAwesomeIcon icon={faThumbtack} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </section>
                            <div className={styles.pickerFooterActions}>
                              <Button
                                type="button"
                                variant="primary"
                                size="md"
                                shape="default"
                                className={styles.pickerApplyButton}
                                onPress={() => applyPickerSelection(characterId)}
                                isDisabled={pickerSelectedSoundIds.length === 0}
                              >
                                {`APPLY TO ${characterName.toUpperCase()}`}
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              type="button"
              variant="secondary"
              shape="pill"
              className={styles.refreshButton}
              onPress={resetBoard}
            >
              Reset Board
            </Button>

            {!isBlockingOverlayOpen && (
              <div className={styles.hamburgerWrap}>
                <div
                  className={`${styles.hamburger} ${isMenuVisible ? styles.hamburgerActive : ''}`}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <span className={styles.hamburgerBox}>
                    <span className={styles.hamburgerInner}></span>
                  </span>
                </div>
              </div>
            )}

            {!isBlockingOverlayOpen && (
              <Menu
                isOpen={isMenuVisible}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={navigate}
                isLowGraphics={isLowGraphics}
                onToggleLowGraphics={() => setIsLowGraphics((prev) => !prev)}
              />
            )}
            <ProgressionMeter
              state={progressionState}
              currentLevelInfo={currentLevelInfo}
              nextLevelInfo={nextLevelInfo}
            />

            <AchievementUnlockedModal
              isOpen={isLvl2AchievementOpen}
              onClose={() => setIsLvl2AchievementOpen(false)}
              title="Achievement unlocked: Level 2"
              message="Congrats! Level 2 Soundmixer unlocked. Add up to 2 sounds per character. The market will open more soon."
              unlockNextTitle="To unlock Level 3:"
              unlockNextLines={lvl2UnlockNextLines}
              buttonLabel="Hurrah!"
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
