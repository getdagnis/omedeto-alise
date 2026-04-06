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
  description: string;
  benefitTitle: string;
  benefitDetail: string;
  benefitIcon: string;
  requirements: LevelRequirement;
};

export const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    level: 0,
    name: 'Normal',
    soundsPerCharacter: 3,
    description: 'The standard mix experience.',
    benefitTitle: 'Basic Mix',
    benefitDetail: '3 sounds per character, 1 custom color.',
    benefitIcon: '✨',
    requirements: {},
  },
  {
    level: 1,
    name: 'Dual Boost',
    soundsPerCharacter: 4,
    description: 'Double the audio power.',
    benefitTitle: 'Dual Sounds',
    benefitDetail: '4 sounds per character, unlock 3 custom colors.',
    benefitIcon: '⚡',
    requirements: { charactersPlayed: 3, charactersCustomized: 3, soundsPlayed: 6 },
  },
  {
    level: 2,
    name: 'Triple Mode',
    soundsPerCharacter: 6,
    description: 'Unleash the full spectrum.',
    benefitTitle: 'Triple Sounds',
    benefitDetail: '6 sounds per character, unlock custom character images.',
    benefitIcon: '🌈',
    requirements: { charactersCustomized: 9, minutesPlayed: 9, soundsPlayed: 12 },
  },
  {
    level: 3,
    name: 'Sonic Master',
    soundsPerCharacter: 9,
    description: 'A master of the character board.',
    benefitTitle: 'Secret Sounds',
    benefitDetail: '9 sounds per character, unlock secret sound banks.',
    benefitIcon: '🎧',
    requirements: { charactersCustomized: 18, minutesPlayed: 30, soundsPlayed: 24 },
  },
  {
    level: 4,
    name: 'Ultra Mode',
    soundsPerCharacter: 12, // MAX
    description: 'The ultimate celebratory experience.',
    benefitTitle: 'Personal Messages',
    benefitDetail: '12 sounds per character, unlock character chat bubbles.',
    benefitIcon: '👑',
    requirements: { charactersCustomized: 24, minutesPlayed: 60, soundsPlayed: 36 },
  },
];

export type ProgressionState = {
  playedCharacterIds: string[];
  customizedCharacterIds: string[];
  playedSoundIds: string[];
  ownedSoundIds: string[];
  favoriteSoundIds: string[];
  discoveredComboIds: string[];
  minutesPlayed: number;
  unlockedLevel: number;
  walletBalance: number;
};

export const DEFAULT_PROGRESSION_STATE: ProgressionState = {
  playedCharacterIds: [],
  customizedCharacterIds: [],
  playedSoundIds: [],
  ownedSoundIds: [],
  favoriteSoundIds: [],
  discoveredComboIds: [],
  minutesPlayed: 0,
  unlockedLevel: 2, // Starts at Level 2 - @keep
  walletBalance: 1000,
};
