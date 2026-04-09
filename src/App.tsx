import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './App.module.sass';
import CharacterGrid from './components/CharacterGrid';
import EditCharacterModal from './components/EditCharacterModal';
import ProgressionMeter from './components/ProgressionMeter';
import { Menu } from './components/Menu/Menu';
import Shop from './components/Shop/Shop';
import Admin from './components/Admin/Admin';
import SandboxUI from './screens/SandboxUI';
import PlatformTest1 from './screens/PlatformTests/PlatformTest1';
import PlatformTest2 from './screens/PlatformTests/PlatformTest2';
import PlatformTest3 from './screens/PlatformTests/PlatformTest3';
import { useProgression } from './hooks/useProgression';
import { PROGRESSION_LEVELS } from './progression';
import { Button } from './components-ui';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import { CharacterProfile } from './components/CharacterProfile/CharacterProfile';
import {
  ALL_SOUNDS,
  BACKGROUND_IMAGE_KEYS,
  CHARACTER_COLOR_TOKENS,
  CHARACTER_IMAGE_OPTIONS,
  CHARACTERS,
  COMBOS,
  LOCALIZATIONS,
} from './config';

const CHARACTER_PLACEHOLDER_PATH = '/alise-1.svg';
const BG_DESKTOP_SUFFIX = '1920';
const BG_MOBILE_SUFFIX = 'mob';
const GLOW_BURST_MS = 2200;
const MAX_SOUNDS_TOTAL = 12;
const LOW_GRAPHICS_STORAGE_KEY = 'alise-in-tokyo-low-graphics';
const MAX_CHARACTER_SOUNDS = 9;

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
  soundIds?: string[]; // Active Selection (max 6)
  cloudSoundIds?: string[]; // Constellation Pool (max 24)
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

const INITIAL_CLOUDS_COUNT = 24; // @keep
const CHARACTER_CUSTOM_STORAGE_KEY = 'alise-in-tokyo-character-custom-v5';

const parseCharacterCustomStorage = (): CharacterCustomizationMap => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(CHARACTER_CUSTOM_STORAGE_KEY);
    if (!stored) {
      // INITIAL STATE FOR NEW USER - @keep start
      return {
        alise: {
          image: '/chars/alise-1.png',
          name: 'Alise',
          // 6 selected sounds from 2 initial combos
          soundIds: ['fly-me', 'synth-rise', 'synth-garden', 'energy', 'candy-machine', 'alert'],
          // Constellation Pool
          cloudSoundIds: [
            'fly-me',
            'synth-rise',
            'synth-garden',
            'energy',
            'candy-machine',
            'alert',
            'kick1',
            'noise1',
            'peace1',
            'tomorrow',
            'alien',
            'busy',
            'anthenna',
            'cartoon',
            'drama',
            'machines',
            'synth-garden',
            'synth-grow',
            'synth-space',
            'kick1',
            'beat1',
            'beat2',
            'beat3',
            'monks',
          ].slice(0, INITIAL_CLOUDS_COUNT),
        },
      };
      // @keep end
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
      if (Array.isArray(typed.cloudSoundIds)) {
        next.cloudSoundIds = typed.cloudSoundIds.filter((s) => typeof s === 'string').slice(0, INITIAL_CLOUDS_COUNT);
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
  const mainCharacterId = 'alise';
  const stageCharacterIds = ['placeholder-1', 'placeholder-2', 'alise', 'placeholder-3', 'gumi'];

  const [activeSoundsByCharacter, setActiveSoundsByCharacter] = useState<Record<string, string[]>>({
    alise: [], // Starts empty - @keep
  });
  const [loadedCharacterMap, setLoadedCharacterMap] = useState<Record<string, boolean>>({});
  const [characterCustomizations, setCharacterCustomizations] = useState<CharacterCustomizationMap>(() =>
    parseCharacterCustomStorage(),
  );
  const [mutedCharacterIds, setMutedCharacterIds] = useState<Set<string>>(new Set());
  const [pickerSelectedSoundIds, setPickerSelectedSoundIds] = useState<string[]>([]);
  const [initialEditTab, setInitialEditTab] = useState<'colors' | 'sounds'>('colors');

  const profileCharacterId = useMemo(() => {
    const match = currentPath.match(/^\/(.+)\/profile$/);
    if (match) return match[1];
    return null;
  }, [currentPath]);

  const editingCharacterId = useMemo(() => {
    const match = currentPath.match(/^\/(.+)\/edit$/);
    if (match) return match[1];
    return null;
  }, [currentPath]);

  const isShopOpen = currentPath === '/shop';
  const isAdminOpen = currentPath === '/admin';
  const isSandboxUIOpen = currentPath === '/sandbox';
  const isPlatformTest1 = currentPath === '/platform-test-1';
  const isPlatformTest2 = currentPath === '/platform-test-2';
  const isPlatformTest3 = currentPath === '/platform-test-3';
  const isInternalRoute = isAdminOpen || isSandboxUIOpen || isPlatformTest1 || isPlatformTest2 || isPlatformTest3;

  const [isGlowBurst, setIsGlowBurst] = useState(false);
  const [comboWord, setComboWord] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    recordComboDiscovered,
    buySound,
    toggleFavoriteSound,
  } = useProgression();

  const [isLvl2AchievementOpen, setIsLvl2AchievementOpen] = useState(false);
  const lastUnlockedLevelRef = useRef<number>(progressionState.unlockedLevel);

  useEffect(() => {
    const prev = lastUnlockedLevelRef.current;
    const next = progressionState.unlockedLevel;
    if (!isLvl2AchievementOpen && prev < 1 && next === 1) {
      window.setTimeout(() => setIsLvl2AchievementOpen(true), 0);
    }
    lastUnlockedLevelRef.current = next;
  }, [progressionState.unlockedLevel, isLvl2AchievementOpen]);

  useEffect(() => {
    if (editingCharacterId) {
      savedScrollPositionRef.current = window.scrollY;
      window.scrollTo(0, 0);
    } else if (savedScrollPositionRef.current !== 0) {
      window.scrollTo(0, savedScrollPositionRef.current);
      savedScrollPositionRef.current = 0;
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

  const clearPreviewAudio = useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
  }, []);

  const startPickerPreview = useCallback(
    (soundId: string, path: string) => {
      clearPreviewAudio();
      const audio = new Audio(path);
      audio.loop = false;
      audio.onended = () => {
        setPreviewingSoundId(null);
      };
      void audio.play().catch(() => undefined);
      previewAudioRef.current = audio;
      setPreviewingSoundId(soundId);
    },
    [clearPreviewAudio],
  );

  const stopPickerPreview = useCallback(() => {
    clearPreviewAudio();
    setPreviewingSoundId(null);
  }, [clearPreviewAudio]);

  const togglePreviewSound = useCallback(
    (soundId: string, path: string) => {
      if (previewingSoundId === soundId) {
        stopPickerPreview();
        return;
      }
      startPickerPreview(soundId, path);
    },
    [previewingSoundId, startPickerPreview, stopPickerPreview],
  );

  const toggleProfileSound = useCallback(
    (soundId: string, path: string) => {
      const isAlreadySelected = pickerSelectedSoundIds.includes(soundId);

      setPickerSelectedSoundIds((previous) => {
        if (isAlreadySelected) {
          return previous.filter((id) => id !== soundId);
        }
        if (previous.length >= currentLevelInfo.soundsPerCharacter) {
          return [...previous.slice(1), soundId];
        }
        return [...previous, soundId];
      });

      if (isAlreadySelected) {
        if (previewingSoundId === soundId) {
          stopPickerPreview();
        }
      } else {
        startPickerPreview(soundId, path);
      }
    },
    [
      currentLevelInfo.soundsPerCharacter,
      pickerSelectedSoundIds,
      previewingSoundId,
      startPickerPreview,
      stopPickerPreview,
    ],
  );

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

  const toggleMuteCharacter = useCallback((characterId: string) => {
    setMutedCharacterIds((previous) => {
      const next = new Set(previous);
      const isMuting = !next.has(characterId);
      if (isMuting) next.add(characterId);
      else next.delete(characterId);
      Object.entries(audioRefs.current).forEach(([key, audio]) => {
        if (key.startsWith(`${characterId}:`)) {
          audio.muted = isMuting;
          if (isMuting) audio.pause();
          else void audio.play().catch(() => undefined);
        }
      });
      return next;
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
        const currentActive = activeSoundsByCharacter[characterId] ?? [];
        const maxSounds = currentLevelInfo.soundsPerCharacter;
        if (currentActive.length >= maxSounds) {
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
        const nextAudio = new Audio(sound.path);
        nextAudio.loop = true;
        void nextAudio.play().catch(() => undefined);
        audioRefs.current[audioKey] = nextAudio;
        activeSoundOrderRef.current.push({ characterId, soundId });
      }
      setActiveSoundsByCharacter((previous) => {
        const current = previous[characterId] ?? [];
        let nextList: string[];
        if (isRemoving) nextList = current.filter((id) => id !== soundId);
        else {
          const maxSounds = currentLevelInfo.soundsPerCharacter;
          nextList = current.length >= maxSounds ? [...current.slice(1), soundId] : [...current, soundId];
        }
        return { ...previous, [characterId]: nextList };
      });
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

  const removeSoundFromCharacter = useCallback(
    (characterId: string, soundId: string) => {
      const audioKey = buildAudioKey(characterId, soundId);
      const audio = audioRefs.current[audioKey];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        delete audioRefs.current[audioKey];
      }
      setActiveSoundsByCharacter((previous) => ({
        ...previous,
        [characterId]: (previous[characterId] ?? []).filter((id) => id !== soundId),
      }));
      setCharacterCustomizations((prev) => {
        const charCustom = prev[characterId] || {};
        const nextSounds = (charCustom.soundIds || []).filter((id) => id !== soundId);
        const next = { ...prev, [characterId]: { ...charCustom, soundIds: nextSounds } };
        persistCharacterCustomStorage(next);
        return next;
      });
    },
    [buildAudioKey],
  );

  const resetCharacter = useCallback(
    (characterId: string) => {
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
      activeSoundOrderRef.current = activeSoundOrderRef.current.filter((e) => e.characterId !== characterId);
      setActiveSoundsByCharacter((previous) => ({ ...previous, [characterId]: [] }));
    },
    [buildAudioKey, unmuteCharacter, activeSoundsByCharacter],
  );

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      const currentSelected = activeSoundsByCharacter[characterId] ?? [];
      setPickerSelectedSoundIds(currentSelected);
      navigate(`/${characterId}/profile`);
    },
    [activeSoundsByCharacter, navigate],
  );

  const handleToggleFavorite = useCallback((characterId: string) => {
    setFavoriteCharacterId((prev) => (prev === characterId ? '' : characterId));
  }, []);

  const resetBoard = useCallback(() => {
    stopAllAudio();
    setActiveSoundsByCharacter({});
    setIsGlowBurst(false);
    activeComboIdRef.current = null;
    setComboWord(null);
  }, [stopAllAudio]);

  const updateCharacterCustomization = useCallback(
    (characterId: string, patch: CharacterCustomization) => {
      recordCharacterCustomized(characterId);
      setCharacterCustomizations((previous) => {
        const current = previous[characterId] ?? {};
        const next = { ...previous, [characterId]: { ...current, ...patch } };
        persistCharacterCustomStorage(next);
        return next;
      });
    },
    [recordCharacterCustomized],
  );

  const closeProfile = useCallback(() => {
    clearPreviewAudio();
    setPreviewingSoundId(null);
    navigate('/');
  }, [clearPreviewAudio, navigate]);

  const applyProfileSelection = useCallback(
    (characterId: string, patch?: CharacterCustomization) => {
      const nextSelected = patch?.soundIds ?? pickerSelectedSoundIds;
      updateCharacterCustomization(characterId, { ...patch, soundIds: nextSelected });
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
        void audio.play().catch(() => undefined);
        audioRefs.current[audioKey] = audio;
        activeSoundOrderRef.current.push({ characterId, soundId });
        recordSoundPlayed(characterId, soundId);
      });
      setActiveSoundsByCharacter((previous) => ({ ...previous, [characterId]: nextSelected }));
      closeProfile();
    },
    [
      activeSoundsByCharacter,
      buildAudioKey,
      closeProfile,
      pickerSelectedSoundIds,
      recordSoundPlayed,
      soundCatalogById,
      unmuteCharacter,
      updateCharacterCustomization,
    ],
  );

  useEffect(() => {
    const total = Object.values(activeSoundsByCharacter).reduce((sum, ids) => sum + ids.length, 0);
    if (total >= MAX_SOUNDS_TOTAL && totalActiveSoundsRef.current < MAX_SOUNDS_TOTAL) {
      setTimeout(() => triggerGlowBurst(), 0);
    }
    totalActiveSoundsRef.current = total;
  }, [activeSoundsByCharacter, triggerGlowBurst]);

  useEffect(() => {
    const activeSet = new Set(Object.values(activeSoundsByCharacter).flat());
    const matchedCombo = COMBOS.find((combo) => combo.soundIds.every((soundId) => activeSet.has(soundId)));
    if (!matchedCombo || activeComboIdRef.current === matchedCombo.id) return;
    activeComboIdRef.current = matchedCombo.id;
    recordComboDiscovered(matchedCombo.id);
    setTimeout(() => setComboWord(matchedCombo.name), 0);
    window.setTimeout(() => setComboWord(null), 2200);
  }, [activeSoundsByCharacter, recordComboDiscovered]);

  const toggleMuteMix = useCallback(
    (characterId: string) => {
      toggleMuteCharacter(characterId);
    },
    [toggleMuteCharacter],
  );

  const stageCharacters = useMemo(() => {
    return stageCharacterIds.map((id) => CHARACTERS.find((c) => c.id === id)).filter((c): c is any => !!c);
  }, [stageCharacterIds]);

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
  const isBlockingOverlayOpen = Boolean(editingCharacterId || profileCharacterId);
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
      <div className={styles.background} style={{ '--bg-image': `url(${activeBackgroundImage})` } as CSSProperties} />
      <div className={styles.backgroundOverlay} />
      <main className={styles.content}>
        {isInternalRoute ? (
          <>
            {(isAdminOpen || isSandboxUIOpen) && (
              <section className={styles.internalPage}>
                <header className={styles.internalPageHeader}>
                  <Button variant="secondary" size="sm" onPress={() => navigate('/')}>
                    Back
                  </Button>
                </header>
                <div className={styles.internalPageBody}>
                  {isAdminOpen && <Admin onPreviewSound={togglePreviewSound} previewingSoundId={previewingSoundId} />}
                  {isSandboxUIOpen && <SandboxUI />}
                </div>
              </section>
            )}
            {isPlatformTest1 && <PlatformTest1 onClose={() => navigate('/')} />}
            {isPlatformTest2 && <PlatformTest2 onClose={() => navigate('/')} />}
            {isPlatformTest3 && <PlatformTest3 onClose={() => navigate('/')} />}
          </>
        ) : profileCharacterId ? (
          <CharacterProfile
            characterId={profileCharacterId}
            character={CHARACTERS.find((c) => c.id === profileCharacterId)!}
            characters={CHARACTERS}
            characterCustomizations={characterCustomizations}
            activeSounds={pickerSelectedSoundIds}
            unlockedLevel={progressionState.unlockedLevel}
            soundsPerCharacter={currentLevelInfo.soundsPerCharacter}
            soundCatalogById={soundCatalogById}
            onClose={closeProfile}
            onToggleSound={(soundId, path) => toggleProfileSound(soundId, path)}
            onApply={(patch) => applyProfileSelection(profileCharacterId, patch)}
            onNavigateShop={() => navigate('/shop')}
            discoveredComboIds={progressionState.discoveredComboIds}
            onRecordCombo={recordComboDiscovered}
            colorOptions={CHARACTER_COLOR_OPTIONS}
            imageOptions={CHARACTER_IMAGE_OPTIONS}
            isMain={profileCharacterId === mainCharacterId}
            favoriteSoundIds={progressionState.favoriteSoundIds}
            onToggleFavoriteSound={toggleFavoriteSound}
          />
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
                <h1 className={styles.titleJapanese}>アリス・イン・トーキョー</h1>
                <p className={styles.titleName}>
                  ALISE <span>in</span> TOKYO!
                </p>
              </header>
              <CharacterGrid
                characters={stageCharacters}
                mainCharacterId={mainCharacterId}
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
                onDropSound={(event, id) => {
                  event.preventDefault();
                  const s = event.dataTransfer.getData('text/plain');
                  if (s) setSingleSound(id, s);
                }}
                onImageLoad={(id) => setLoadedCharacterMap((p) => ({ ...p, [id]: true }))}
                onEditCharacter={(id) => {
                  setInitialEditTab('colors');
                  navigate(`/${id}/edit`);
                }}
                onResetCharacter={resetCharacter}
                onOpenSoundPicker={handleCharacterClick}
                onToggleSound={setSingleSound}
                onRemoveSound={removeSoundFromCharacter}
                onToggleMute={toggleMuteMix}
                onOpenProfile={(id) => navigate(`/${id}/profile`)}
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
              onSelectCharacter={(id) => navigate(`/${id}/edit`)}
              onUpdateCustomization={updateCharacterCustomization}
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
              <div className={styles.hamburgerWrap} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className={`${styles.hamburger} ${isMenuVisible ? styles.hamburgerActive : ''}`}>
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
                onToggleLowGraphics={() => setIsLowGraphics(!isLowGraphics)}
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
              message="Congrats! Level 2 Soundmixer unlocked."
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
