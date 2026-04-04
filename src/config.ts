import { LIBRARY_BASE_SOUNDS } from './library_sounds';

export type SoundAnimation = 'slow' | 'fast' | 'both';

export type SoundCategory = 'voice' | 'beats' | 'drums' | 'animals' | 'melody' | 'creepy' | 'calm' | 'other';

export type SoundMood =
  | 'creepy'
  | 'happy'
  | 'calm'
  | 'scary'
  | 'energetic'
  | 'powerful'
  | 'tokyo'
  | 'cyberpunk'
  | 'other';

export type SoundType = 'music' | 'sfx' | 'beat' | 'voice' | 'animal' | 'nature';

export type SoundOption = {
  id: string;
  name: string;
  path: string;
  colorToken: string;
  animation: SoundAnimation;
  category: SoundCategory; // Legacy, keeping for compatibility
  type: SoundType;
  mood: SoundMood;
  price: number;
};

export type Combo = {
  id: string;
  name: string;
  soundIds: string[];
  description: string;
  rarity: 'common' | 'rare' | 'ultra';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: string;
};

export const COMBOS: Combo[] = [
  {
    id: 'starlight',
    name: 'Starlight!',
    soundIds: ['ok', 'energy', 'fly-me'],
    description: 'A shimmering celestial melody.',
    rarity: 'common',
  },
  {
    id: 'cosmic',
    name: 'Cosmic!',
    soundIds: ['synth-rise', 'synth-space', 'synth-night'],
    description: 'The sound of the deep void.',
    rarity: 'rare',
  },
  {
    id: 'mischief',
    name: 'Mischief!',
    soundIds: ['laugh', 'laugh-2', 'laugh-3'],
    description: 'Something is definitely up.',
    rarity: 'common',
  },
  {
    id: 'encore',
    name: 'Encore!',
    soundIds: ['beat-1', 'beat-2', 'beat-3'],
    description: 'The crowd wants more.',
    rarity: 'ultra',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-mix', title: 'First Mix', description: 'Created your first sound combination.' },
  { id: 'collector', title: 'Sound Collector', description: 'Unlocked 10 different sounds.' },
  { id: 'tokyo-night', title: 'Tokyo Night', description: 'Spent 1 hour mixing in the city.' },
];

type BaseSoundOption = Omit<SoundOption, 'colorToken'>;

export type CharacterColorScheme = {
  id: string;
  name: string;
  titleColor: string;
  primaryColor: string;
  secondaryColor: string;
  soundboardColor: string;
};

export type CharacterOption = {
  id: string;
  name: string;
  img: string;
  mixLabel: string;
  titleColor: string;
  primaryColor: string;
  secondaryColor: string;
  soundboardColor: string;
  schemes: CharacterColorScheme[];
  sounds: SoundOption[];
};

// export const BACKGROUND_IMAGE_KEYS = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5'] as const;
export const BACKGROUND_IMAGE_KEYS = ['bg2'] as const;

export type Localizations = {
  currencySymbol: string;
  currencyName: string;
  currencyPlural: string;
  currencyFullName: string;
  currencyFullPlural: string;
  currencyAbreviation: string;
};

export const LOCALIZATIONS: Localizations = {
  currencySymbol: '₵',
  currencyName: 'coin',
  currencyPlural: 'coins',
  currencyFullName: 'alisecoin',
  currencyFullPlural: 'alisecoins',
  currencyAbreviation: 'TAC',
};

const SOUND_COLOR_TOKENS = [
  '--color-mood-tokyo-1',
  '--color-mood-tokyo-2',
  '--color-mood-tokyo-3',
  '--color-mood-tokyo-4',
  '--color-mood-tokyo-5',
  '--color-mood-tokyo-6',
  '--color-mood-tokyo-7',
  '--color-mood-tokyo-8',
  '--color-mood-tokyo-9',
  '--color-mood-tokyo-10',
  '--color-mood-tokyo-11',
  '--color-mood-tokyo-12',
  '--color-mood-tokyo-13',
  '--color-mood-tokyo-14',
  '--color-mood-tokyo-15',
  '--color-mood-tokyo-16',
  '--color-mood-tokyo-17',
  '--color-mood-tokyo-18',
  '--color-mood-tokyo-19',
  '--color-mood-tokyo-20',
] as const;

export const CHARACTER_COLOR_TOKENS = SOUND_COLOR_TOKENS.slice(0, 18);

const mapSoundColors = (baseSounds: BaseSoundOption[]): SoundOption[] =>
  baseSounds.map((sound, index) => ({
    ...sound,
    colorToken: SOUND_COLOR_TOKENS[index % SOUND_COLOR_TOKENS.length],
  }));

const GUMI_BASE_SOUNDS: BaseSoundOption[] = [
  {
    id: 'ok',
    name: 'Ok',
    path: '/gumi/ok.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 20,
  },
  {
    id: 'yokune',
    name: 'Yokune',
    path: '/gumi/Yokune.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'energy',
    name: 'Energy',
    path: '/gumi/energy.wav',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'energetic',
    price: 60,
  },
  {
    id: 'fly-me',
    name: 'Fly Me',
    path: '/gumi/fly-me.wav',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'calm',
    price: 50,
  },
  {
    id: 'grow',
    name: 'Grow',
    path: '/gumi/grow.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'sfx',
    mood: 'powerful',
    price: 30,
  },
  {
    id: 'synth-rise',
    name: 'Synth Rise',
    path: '/gumi/synth%20rise.wav',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'cyberpunk',
    price: 80,
  },
  {
    id: 'kick-1',
    name: 'Kick It!',
    path: '/gumi/kick1.wav',
    animation: 'fast',
    category: 'drums',
    type: 'beat',
    mood: 'powerful',
    price: 40,
  },
  {
    id: 'machines',
    name: 'Machines',
    path: '/gumi/machines.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'cyberpunk',
    price: 35,
  },
  {
    id: 'oh-boy',
    name: 'Oh Boy',
    path: '/gumi/oh-boy.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 25,
  },
  {
    id: 'peace-1',
    name: 'Peace Out',
    path: '/gumi/peace1.wav',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'calm',
    price: 30,
  },
  {
    id: 'sad',
    name: 'Sad',
    path: '/gumi/sad.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'sfx',
    mood: 'creepy',
    price: 45,
  },
  {
    id: 'noise-1',
    name: 'Noise',
    path: '/gumi/noise1.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'cyberpunk',
    price: 20,
  },
  {
    id: 'alien',
    name: 'Alien',
    path: '/gumi/alien.wav',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'scary',
    price: 55,
  },
  {
    id: 'synth-forest',
    name: 'Synth Forest',
    path: '/gumi/synth%20forest.wav',
    animation: 'fast',
    category: 'calm',
    type: 'nature',
    mood: 'calm',
    price: 70,
  },
  {
    id: 'synth-garden',
    name: 'Synth Garden',
    path: '/gumi/synth%20garden.wav',
    animation: 'fast',
    category: 'calm',
    type: 'nature',
    mood: 'happy',
    price: 65,
  },
  {
    id: 'tomorrow',
    name: 'Tomorrow',
    path: '/gumi/tomorrow.wav',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'tokyo',
    price: 90,
  },
  {
    id: 'anthenna',
    name: 'Anthenna',
    path: '/gumi/anthenna.wav',
    animation: 'fast',
    category: 'melody',
    type: 'sfx',
    mood: 'cyberpunk',
    price: 40,
  },
  {
    id: 'busy',
    name: 'Busy',
    path: '/gumi/busy.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'energetic',
    price: 30,
  },
  {
    id: 'candy-machine',
    name: 'Synth Candy',
    path: '/gumi/candy-machine.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'sfx',
    mood: 'happy',
    price: 50,
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    path: '/gumi/cartoon.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'happy',
    price: 20,
  },
  {
    id: 'drama',
    name: 'Drama',
    path: '/gumi/drama.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'powerful',
    price: 40,
  },
  {
    id: 'synth-grow',
    name: 'Synth Grow',
    path: '/gumi/synth%20grow.wav',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'powerful',
    price: 75,
  },
  {
    id: 'synth-night',
    name: 'Synth Night',
    path: '/gumi/synth%20night.mp3',
    animation: 'fast',
    category: 'calm',
    type: 'music',
    mood: 'tokyo',
    price: 85,
  },
  {
    id: 'synth-space',
    name: 'Synth Space',
    path: '/gumi/synth%20space.wav',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'cyberpunk',
    price: 100,
  },
  {
    id: 'alert',
    name: 'Alert',
    path: '/gumi/alert.wav',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'scary',
    price: 30,
  },
];

const HANAKO_BASE_SOUNDS: BaseSoundOption[] = [
  {
    id: 'horror',
    name: 'Horror',
    path: '/hanako/horror.mp3',
    animation: 'fast',
    category: 'creepy',
    type: 'sfx',
    mood: 'scary',
    price: 90,
  },
  {
    id: 'polyphon',
    name: 'Polyphon',
    path: '/hanako/polyphon.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'tokyo',
    price: 70,
  },
  {
    id: 'trombone',
    name: 'Trombone',
    path: '/hanako/trombone.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'happy',
    price: 40,
  },
  {
    id: 'violins',
    name: 'Violins',
    path: '/hanako/violins.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'creepy',
    price: 60,
  },
  {
    id: 'laugh',
    name: 'Laugh',
    path: '/hanako/laugh.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 20,
  },
  {
    id: 'laugh-2',
    name: 'Laugh 2',
    path: '/hanako/laugh2.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 20,
  },
  {
    id: 'laugh-3',
    name: 'Laugh 3',
    path: '/hanako/laugh3.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'scary',
    price: 30,
  },
  {
    id: 'beat-2',
    name: 'Beat 2',
    path: '/hanako/beat2.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'energetic',
    price: 50,
  },
  {
    id: 'beat-3',
    name: 'Beat 3',
    path: '/hanako/beat3.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'powerful',
    price: 50,
  },
  {
    id: 'cry',
    name: 'Cry',
    path: '/hanako/cry.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'creepy',
    price: 40,
  },
  {
    id: 'drums-1',
    name: 'Drums 1',
    path: '/hanako/drums1.mp3',
    animation: 'fast',
    category: 'drums',
    type: 'beat',
    mood: 'energetic',
    price: 45,
  },
  {
    id: 'cow',
    name: 'Cow',
    path: '/hanako/cow.mp3',
    animation: 'slow',
    category: 'animals',
    type: 'animal',
    mood: 'happy',
    price: 25,
  },
  {
    id: 'drums-2',
    name: 'Drums 2',
    path: '/hanako/drums2.mp3',
    animation: 'fast',
    category: 'drums',
    type: 'beat',
    mood: 'powerful',
    price: 45,
  },
  {
    id: 'giggle',
    name: 'Giggle',
    path: '/hanako/giggle.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 20,
  },
  {
    id: 'goat',
    name: 'Goat',
    path: '/hanako/goat.mp3',
    animation: 'slow',
    category: 'animals',
    type: 'animal',
    mood: 'happy',
    price: 25,
  },
  {
    id: 'guitar',
    name: 'Guitar',
    path: '/hanako/guitar.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'calm',
    price: 50,
  },
  {
    id: 'monks',
    name: 'Monks',
    path: '/hanako/monks.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'calm',
    price: 60,
  },
  {
    id: 'beat-4',
    name: 'Beat 4',
    path: '/hanako/beat4.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 50,
  },
  {
    id: 'beat-1',
    name: 'Beat 1',
    path: '/hanako/beat1.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'tokyo',
    price: 50,
  },
  {
    id: 'choir',
    name: 'Choir',
    path: '/hanako/choir.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'powerful',
    price: 80,
  },
  {
    id: 'christmas',
    name: 'Christmas',
    path: '/hanako/christmas.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'happy',
    price: 30,
  },
  {
    id: 'applause',
    name: 'Applause',
    path: '/hanako/applause.mp3',
    animation: 'slow',
    category: 'other',
    type: 'sfx',
    mood: 'happy',
    price: 20,
  },
];

export const ALL_SOUNDS = mapSoundColors([...GUMI_BASE_SOUNDS, ...HANAKO_BASE_SOUNDS, ...LIBRARY_BASE_SOUNDS]);

export const SOUNDS = {
  gumi: mapSoundColors(GUMI_BASE_SOUNDS),
  hanako: mapSoundColors(HANAKO_BASE_SOUNDS),
  library: mapSoundColors(LIBRARY_BASE_SOUNDS),
  all: ALL_SOUNDS,
} as const;

const PLACEHOLDER_SCHEMES: CharacterColorScheme[] = [
  {
    id: 'neon',
    name: 'Neon Ash',
    titleColor: '#f8f8ff',
    primaryColor: '#5b5a68cc',
    secondaryColor: '#9a9aaea1',
    soundboardColor: '#2a2a33cc',
  },
  {
    id: 'ember',
    name: 'Ember Smoke',
    titleColor: '#fff4ef',
    primaryColor: '#c24f3fcc',
    secondaryColor: '#f2b48ca1',
    soundboardColor: '#3a1c1acc',
  },
  {
    id: 'nebula',
    name: 'Nebula Drift',
    titleColor: '#f4f7ff',
    primaryColor: '#3b4cc9cc',
    secondaryColor: '#8db3ffa1',
    soundboardColor: '#1b2142cc',
  },
  {
    id: 'mint',
    name: 'Mint Static',
    titleColor: '#e9fff7',
    primaryColor: '#2cbd93cc',
    secondaryColor: '#7fffd4a1',
    soundboardColor: '#103527cc',
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    titleColor: '#fff6fb',
    primaryColor: '#d36aa4cc',
    secondaryColor: '#ffc0e1a1',
    soundboardColor: '#3a1b2dcc',
  },
];

export const CHARACTERS: CharacterOption[] = [
  {
    id: 'alise',
    name: 'ALISE',
    img: '/alise-1.png',
    mixLabel: "Alise's Mix!",
    titleColor: 'white',
    primaryColor: '#7c3aed',
    secondaryColor: '#ff0040',
    soundboardColor: '#29063a',
    schemes: [
      {
        id: 'default',
        name: 'Neon Violet',
        titleColor: 'white',
        primaryColor: '#7c3aed',
        secondaryColor: '#ff0040',
        soundboardColor: '#29063a',
      },
      {
        id: 'nova',
        name: 'Nova Bloom',
        titleColor: 'white',
        primaryColor: '#6b1bb1cc',
        secondaryColor: '#ff2f6ba1',
        soundboardColor: '#2d083fcc',
      },
      {
        id: 'azure',
        name: 'Azure Burst',
        titleColor: 'white',
        primaryColor: '#2b6fd7cc',
        secondaryColor: '#58d6ffa6',
        soundboardColor: '#0b2a4acc',
      },
      {
        id: 'cherry',
        name: 'Cherry Glow',
        titleColor: 'white',
        primaryColor: '#c71f5acc',
        secondaryColor: '#ff8acfa1',
        soundboardColor: '#43102fcc',
      },
      {
        id: 'midnight',
        name: 'Midnight Pulse',
        titleColor: 'white',
        primaryColor: '#1a1b4bcc',
        secondaryColor: '#6f3effa6',
        soundboardColor: '#121426cc',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'gumi',
    name: 'Mystery',
    img: '/alise-1.svg',
    mixLabel: "Mystery's Mix!",
    titleColor: 'white',
    primaryColor: '#6ede3e',
    secondaryColor: '#234315',
    soundboardColor: '#243b0e',
    schemes: [
      {
        id: 'default',
        name: 'Spring Green',
        titleColor: 'white',
        primaryColor: '#6ede3e',
        secondaryColor: '#234315',
        soundboardColor: '#243b0e',
      },
      {
        id: 'citrus',
        name: 'Citrus Pop',
        titleColor: 'white',
        primaryColor: '#b9ff3acc',
        secondaryColor: '#44d43fa1',
        soundboardColor: '#2c4b14cc',
      },
      {
        id: 'neon',
        name: 'Neon Mint',
        titleColor: 'white',
        primaryColor: '#2eff9acc',
        secondaryColor: '#00c8ffa1',
        soundboardColor: '#0a2f2bcc',
      },
      {
        id: 'forest',
        name: 'Deep Forest',
        titleColor: 'white',
        primaryColor: '#1f7a3dcc',
        secondaryColor: '#0e2f1ca1',
        soundboardColor: '#0e2417cc',
      },
      {
        id: 'honey',
        name: 'Honey Sun',
        titleColor: '#20170c',
        primaryColor: '#f9d423cc',
        secondaryColor: '#f08a24a1',
        soundboardColor: '#3b2b10cc',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'hanako',
    name: 'Secret',
    img: '/alise-1.svg',
    mixLabel: "Secret's Mix!",
    titleColor: 'white',
    primaryColor: '#ef4444',
    secondaryColor: '#990026',
    soundboardColor: '#990026',
    schemes: [
      {
        id: 'default',
        name: 'Crimson Ink',
        titleColor: 'white',
        primaryColor: '#ef4444',
        secondaryColor: '#990026',
        soundboardColor: '#990026',
      },
      {
        id: 'lantern',
        name: 'Lantern Glow',
        titleColor: 'white',
        primaryColor: '#ff3b5bcc',
        secondaryColor: '#ff9a4aa1',
        soundboardColor: '#3b0c10cc',
      },
      {
        id: 'midnight',
        name: 'Midnight Shrine',
        titleColor: 'white',
        primaryColor: '#2f1b5dcc',
        secondaryColor: '#7a3bffa1',
        soundboardColor: '#1b1033cc',
      },
      {
        id: 'ivory',
        name: 'Ivory Paper',
        titleColor: '#1f1a1a',
        primaryColor: '#f2e3d3cc',
        secondaryColor: '#d0a38aa1',
        soundboardColor: '#3b2b24cc',
      },
      {
        id: 'bloodmoon',
        name: 'Blood Moon',
        titleColor: 'white',
        primaryColor: '#b4002acc',
        secondaryColor: '#520011a1',
        soundboardColor: '#260009cc',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'placeholder-1',
    name: 'Unknown',
    img: '/alise-1.svg',
    mixLabel: 'Unknown Mix',
    titleColor: PLACEHOLDER_SCHEMES[0].titleColor,
    primaryColor: PLACEHOLDER_SCHEMES[0].primaryColor,
    secondaryColor: PLACEHOLDER_SCHEMES[0].secondaryColor,
    soundboardColor: PLACEHOLDER_SCHEMES[0].soundboardColor,
    schemes: PLACEHOLDER_SCHEMES,
    sounds: ALL_SOUNDS,
  },
  {
    id: 'placeholder-2',
    name: 'Invisible',
    img: '/alise-1.svg',
    mixLabel: 'Invisible Mix',
    titleColor: PLACEHOLDER_SCHEMES[1].titleColor,
    primaryColor: PLACEHOLDER_SCHEMES[1].primaryColor,
    secondaryColor: PLACEHOLDER_SCHEMES[1].secondaryColor,
    soundboardColor: PLACEHOLDER_SCHEMES[1].soundboardColor,
    schemes: PLACEHOLDER_SCHEMES,
    sounds: ALL_SOUNDS,
  },
  {
    id: 'placeholder-3',
    name: 'Hidden',
    img: '/alise-1.svg',
    mixLabel: 'Hidden Mix',
    titleColor: PLACEHOLDER_SCHEMES[2].titleColor,
    primaryColor: PLACEHOLDER_SCHEMES[2].primaryColor,
    secondaryColor: PLACEHOLDER_SCHEMES[2].secondaryColor,
    soundboardColor: PLACEHOLDER_SCHEMES[2].soundboardColor,
    schemes: PLACEHOLDER_SCHEMES,
    sounds: ALL_SOUNDS,
  },
];

export const CHARACTER_IMAGE_OPTIONS = [
  { id: 'alise', label: 'Alise', src: '/alise-1.png' },
  { id: 'gumi', label: 'Gumi', src: '/gumi-1.png' },
  { id: 'hanako', label: 'Hanako', src: '/hanako-1.png' },
  { id: 'placeholder', label: 'Placeholder', src: '/alise-1.svg' },
] as const;
