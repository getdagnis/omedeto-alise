import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ProgressionState } from '../progression';
import { DEFAULT_PROGRESSION_STATE, PROGRESSION_LEVELS } from '../progression';

export const PROGRESSION_STORAGE_KEY = 'alise-in-tokyo-progression-v2';

export function useProgression() {
  const [state, setState] = useState<ProgressionState>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESSION_STATE;
    try {
      const stored = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROGRESSION_STATE, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PROGRESSION_STATE;
  });

  const [hasInteractedThisMinute, setHasInteractedThisMinute] = useState(false);
  const interactionTimeoutRef = useRef<number | null>(null);
  const lastSavedStateRef = useRef<ProgressionState>(state);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(state));
      lastSavedStateRef.current = state;
    }
  }, [state]);

  // Active minutes tracker
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasInteractedThisMinute) {
        setState((prev) => ({
          ...prev,
          minutesPlayed: prev.minutesPlayed + 1,
        }));
        setHasInteractedThisMinute(false);
      }
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [hasInteractedThisMinute]);

  const recordInteraction = useCallback(() => {
    setHasInteractedThisMinute(true);
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      setHasInteractedThisMinute(false);
    }, 30000); // 30 seconds of inactivity clears the "active this minute" flag.
  }, []);

  const recordSoundPlayed = useCallback(
    (characterId: string, soundId: string) => {
      recordInteraction();
      setState((prev) => {
        let changed = false;
        const nextPlayedCharacterIds = new Set(prev.playedCharacterIds);
        const nextPlayedSoundIds = new Set(prev.playedSoundIds);

        if (!nextPlayedCharacterIds.has(characterId)) {
          nextPlayedCharacterIds.add(characterId);
          changed = true;
        }
        if (!nextPlayedSoundIds.has(soundId)) {
          nextPlayedSoundIds.add(soundId);
          changed = true;
        }

        if (changed) {
          return {
            ...prev,
            playedCharacterIds: Array.from(nextPlayedCharacterIds),
            playedSoundIds: Array.from(nextPlayedSoundIds),
          };
        }
        return prev;
      });
    },
    [recordInteraction],
  );

  const recordCharacterCustomized = useCallback(
    (characterId: string) => {
      recordInteraction();
      setState((prev) => {
        if (!prev.customizedCharacterIds.includes(characterId)) {
          return {
            ...prev,
            customizedCharacterIds: [...prev.customizedCharacterIds, characterId],
          };
        }
        return prev;
      });
    },
    [recordInteraction],
  );

  const buySound = useCallback((soundId: string, price: number) => {
    setState((prev) => {
      if (prev.ownedSoundIds.includes(soundId)) return prev;
      if (prev.walletBalance < price) return prev;

      return {
        ...prev,
        walletBalance: prev.walletBalance - price,
        ownedSoundIds: [...prev.ownedSoundIds, soundId],
      };
    });
  }, []);
  const grantOwnedSound = useCallback((soundId: string) => {
    setState((prev) => {
      if (prev.ownedSoundIds.includes(soundId)) return prev;

      return {
        ...prev,
        ownedSoundIds: [...prev.ownedSoundIds, soundId],
      };
    });
  }, []);

  const upgradeCharacter = useCallback((characterId: string, level: number) => {
    setState((prev) => ({
      ...prev,
      characterLevels: {
        ...prev.characterLevels,
        [characterId]: Math.max(prev.characterLevels[characterId] || 0, level),
      },
    }));
  }, []);

  // Calculate current level

  const toggleFavoriteSound = useCallback((soundId: string) => {
    setState((prev) => {
      const isFav = prev.favoriteSoundIds.includes(soundId);
      return {
        ...prev,
        favoriteSoundIds: isFav
          ? prev.favoriteSoundIds.filter((id) => id !== soundId)
          : [...prev.favoriteSoundIds, soundId],
      };
    });
  }, []);

  const recordComboDiscovered = useCallback((comboId: string) => {
    setState((prev) => {
      if (prev.discoveredComboIds.includes(comboId)) return prev;

      return {
        ...prev,
        discoveredComboIds: [...prev.discoveredComboIds, comboId],
      };
    });
  }, []);

  // Calculate current level
  const currentLevelInfo = useMemo(() => {
    let currentLevel = 0;

    for (let i = 1; i < PROGRESSION_LEVELS.length; i++) {
      const level = PROGRESSION_LEVELS[i];
      const reqs = level.requirements;
      let meetsReqs = true;

      if (reqs.charactersPlayed && state.playedCharacterIds.length < reqs.charactersPlayed) meetsReqs = false;
      if (reqs.charactersCustomized && state.customizedCharacterIds.length < reqs.charactersCustomized)
        meetsReqs = false;
      if (reqs.soundsPlayed && state.playedSoundIds.length < reqs.soundsPlayed) meetsReqs = false;
      if (reqs.minutesPlayed && state.minutesPlayed < reqs.minutesPlayed) meetsReqs = false;

      if (meetsReqs) {
        currentLevel = level.level;
      } else {
        break; // Levels are sequential
      }
    }

    // Automatically update unlocked level if newly reached
    if (currentLevel > state.unlockedLevel) {
      // We defer state update to avoid rendering issues
      setTimeout(() => {
        setState((prev) => ({ ...prev, unlockedLevel: currentLevel }));
      }, 0);
    }

    return PROGRESSION_LEVELS[currentLevel];
  }, [state]);

  const nextLevelInfo =
    currentLevelInfo.level < PROGRESSION_LEVELS.length - 1 ? PROGRESSION_LEVELS[currentLevelInfo.level + 1] : null;

  return {
    state,
    currentLevelInfo,
    nextLevelInfo,
    recordSoundPlayed,
    recordCharacterCustomized,
    recordComboDiscovered,
    recordInteraction,
    buySound,
    grantOwnedSound,
    toggleFavoriteSound,
    upgradeCharacter,
  };
}
