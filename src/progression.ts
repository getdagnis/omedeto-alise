export type LevelRequirement = {
  charactersPlayed?: number;
  charactersCustomized?: number;
  soundsPlayed?: number;
  minutesPlayed?: number;
};

export type ProgressionLevel = {
  level: number;
  name: string;
  soundsPerCharacter: number;
  requirements: LevelRequirement;
};

export const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    level: 0,
    name: 'Normal',
    soundsPerCharacter: 1,
    requirements: {},
  },
  {
    level: 1,
    name: 'Dual Boost',
    soundsPerCharacter: 2,
    requirements: { charactersPlayed: 3, charactersCustomized: 3, soundsPlayed: 6 },
  },
  {
    level: 2,
    name: 'Triple Mode',
    soundsPerCharacter: 3,
    requirements: { charactersCustomized: 12, minutesPlayed: 12, soundsPlayed: 18 },
  },
  {
    level: 3,
    name: 'Quad Power',
    soundsPerCharacter: 4,
    requirements: { charactersCustomized: 18, minutesPlayed: 30, soundsPlayed: 24 },
  },
  {
    level: 4,
    name: 'Ultra Mode',
    soundsPerCharacter: 12, // MAX
    requirements: { charactersCustomized: 24, minutesPlayed: 60, soundsPlayed: 36 },
  },
];

export type ProgressionState = {
  playedCharacterIds: string[];
  customizedCharacterIds: string[];
  playedSoundIds: string[];
  minutesPlayed: number;
  unlockedLevel: number;
};

export const DEFAULT_PROGRESSION_STATE: ProgressionState = {
  playedCharacterIds: [],
  customizedCharacterIds: [],
  playedSoundIds: [],
  minutesPlayed: 0,
  unlockedLevel: 0,
};
