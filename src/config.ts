import { LIBRARY_BASE_SOUNDS, PUBLIC_FOLDER_SOUNDS } from './library_sounds';

export type SoundAnimation = 'slow' | 'fast' | 'both';

export type SoundCategory = 'voice' | 'beats' | 'drums' | 'animals' | 'melody' | 'creepy' | 'calm' | 'other' | 'acapella' | 'city' | 'cyberpunk' | 'drumloop' | 'electronic' | 'fun' | 'instruments' | 'japan' | 'lounge' | 'rhythm' | 'tune';

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
  image?: string; // @keep
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
    id: 'tokyo-rises',
    name: 'Tokyo Rises',
    soundIds: ['fly-me', 'synth-rise', 'synth-garden'], // Added garden as glow proxy if glow doesn't exist, let's check sounds
    description: 'A shimmering celestial melody.',
    rarity: 'common',
    image: '/cards/_temp1.png',
  },
  {
    id: 'cyber-pulse',
    name: 'Cyber Pulse',
    soundIds: ['energy', 'candy-machine', 'alert'],
    description: 'The heartbeat of the neon city.',
    rarity: 'rare',
    image: '/cards/_temp2.png',
  },
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

export type CharacterIdentityImage = {
  id: string;
  src: string;
  label: string;
  unlockLevel: number;
};

export type CharacterPerformer = {
  id: string;
  label: string;
  japaneseName: string;
  images: CharacterIdentityImage[];
};

export type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
  soundIds?: string[]; // Active Selection (max 9)
  cloudSoundIds?: string[]; // Constellation Pool (max 24)
  identityId?: string | null;
};

export type CharacterOption = {
  id: string;
  name: string;
  img: string;
  mixLabel: string;
  japaneseName: string; // @keep
  titleColor: string;
  primaryColor: string;
  secondaryColor: string;
  soundboardColor: string;
  schemes: CharacterColorScheme[];
  sounds: SoundOption[];
  identityId?: string; // Links to CharacterPerformer
};

export const AVAILABLE_PERFORMERS: CharacterPerformer[] = [
  {
    id: 'akito',
    label: 'Akito',
    japaneseName: 'アキト',
    images: [
      { id: 'akito-1', src: '/chars/akito-1.png', label: 'Default', unlockLevel: 0 },
    ],
  },
  {
    id: 'alise',
    label: 'Alise',
    japaneseName: 'アリス',
    images: [
      { id: 'alise-1', src: '/chars/alise-1.png', label: 'Default', unlockLevel: 0 },
      { id: 'alise-lvl2-1', src: '/chars/alise-lvl2-1.png', label: 'Neon Bloom', unlockLevel: 3 },
      { id: 'alise-lvl2-2', src: '/chars/alise-lvl2-2.png', label: 'Midnight', unlockLevel: 3 },
      { id: 'alise-lvl3-1', src: '/chars/alise-lvl3-1.png', label: 'Master', unlockLevel: 3 },
    ],
  },
  {
    id: 'foxy',
    label: 'Foxy',
    japaneseName: 'フォクシー',
    images: [
      { id: 'foxy-1', src: '/chars/foxy-1.png', label: 'Classic', unlockLevel: 0 },
      { id: 'foxy-2', src: '/chars/foxy-2.png', label: 'Spirit', unlockLevel: 2 },
      { id: 'foxy-3', src: '/chars/foxy-3.png', label: 'Ethereal', unlockLevel: 2 },
    ],
  },
  {
    id: 'gumi',
    label: 'GUMI',
    japaneseName: 'グミ',
    images: [
      { id: 'gumi-1', src: '/chars/gumi-1.png', label: 'Normal', unlockLevel: 0 },
      { id: 'gumi-cyber-1', src: '/chars/gumi-cyber-1.png', label: 'Cyber', unlockLevel: 2 },
    ],
  },
  {
    id: 'hanako',
    label: 'Hanako',
    japaneseName: '花子',
    images: [
      { id: 'hanako-1', src: '/chars/hanako-1.png', label: 'Shrine', unlockLevel: 0 },
      { id: 'hanako-kun-2', src: '/chars/hanako-kun-2.png', label: 'Uniform', unlockLevel: 2 },
      { id: 'hanako-kun-3', src: '/chars/hanako-kun-3.png', label: 'Spirit', unlockLevel: 2 },
      { id: 'hanako-kun-4', src: '/chars/hanako-kun-4.png', label: 'Legend', unlockLevel: 2 },
    ],
  },
  {
    id: 'kagamine',
    label: 'Kagamine',
    japaneseName: '鏡音リン',
    images: [
      { id: 'kagamine-rin-0', src: '/chars/kagamine-rin-0.png', label: 'Rin Zero', unlockLevel: 0 },
      { id: 'kagamine-rin-1', src: '/chars/kagamine-rin-1.png', label: 'Vocaloid 1', unlockLevel: 0 },
      { id: 'kagamine-rin-2', src: '/chars/kagamine-rin-2.png', label: 'Vocaloid 2', unlockLevel: 0 },
      { id: 'kagamine-cyber-1', src: '/chars/kagamine-cyber-1.png', label: 'Cyber 1', unlockLevel: 2 },
      { id: 'kagamine-cyber-2', src: '/chars/kagamine-cyber-2.png', label: 'Cyber 2', unlockLevel: 2 },
    ],
  },
  {
    id: 'honekoneko',
    label: 'Honekoneko',
    japaneseName: 'ホネコネコ',
    images: [
      { id: 'honekoneko-1', src: '/chars/honekoneko-1.png', label: 'Boney', unlockLevel: 0 },
    ],
  },
];



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
    category: sound.path.includes('/kawaii/') ? 'japan' : sound.path.includes('/loop%20(cyber)/') || sound.path.includes('/loop (cyber)/') ? 'cyberpunk' : sound.category,
    colorToken: SOUND_COLOR_TOKENS[index % SOUND_COLOR_TOKENS.length],
  }));

const ALISE_BASE_SOUNDS: BaseSoundOption[] = [
  {
    id: 'alise-w',
    name: '-W-',
    path: '/alise/-w-.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'alise-flute-melody',
    name: 'Flute Melody',
    path: '/alise/adinkra_audio-flute-melody-280554.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'calm',
    price: 50,
  },
  {
    id: 'alise-squarewave',
    name: 'Squarewave',
    path: '/alise/alien_i_trust-squarewave.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 50,
  },
  {
    id: 'alise-bass-loop',
    name: 'Bass Loop',
    path: '/alise/bass-loop-154191.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'powerful',
    price: 60,
  },
  {
    id: 'alise-future-trap',
    name: 'Future Trap',
    path: '/alise/delon_boomkin-future-trap-music-intro-new-raid-422477.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 60,
  },
  {
    id: 'alise-trap-tone',
    name: 'Trap Tone',
    path: '/alise/freesound_community-trap-tone-30688.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'energetic',
    price: 50,
  },
  {
    id: 'alise-trap-loop',
    name: 'Trap Loop',
    path: '/alise/kamhunt-typical-trap-loop-2b-130751.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'energetic',
    price: 60,
  },
  {
    id: 'alise-nani-kore',
    name: 'Nani Kore',
    path: '/alise/nanikore.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'alise-qaqa',
    name: 'Qaqa',
    path: '/alise/qaqa.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'happy',
    price: 40,
  },
  {
    id: 'alise-sers',
    name: 'Sers',
    path: '/alise/sers.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'alise-synth-pad',
    name: 'Synth Pad',
    path: '/alise/synth-pad-loop-88710.mp3',
    animation: 'slow',
    category: 'calm',
    type: 'music',
    mood: 'calm',
    price: 60,
  },
  {
    id: 'alise-synthwave',
    name: 'Synthwave',
    path: '/alise/synthwave-loop-v1-254569.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 60,
  },
  {
    id: 'alise-techno-melody',
    name: 'Techno Melody',
    path: '/alise/techno-melody.mp3',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'energetic',
    price: 70,
  },
  {
    id: 'alise-trance-beat',
    name: 'Trance Beat',
    path: '/alise/trance-beat-loop-m-janneman.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'energetic',
    price: 70,
  },
  {
    id: 'alise-trance-loop',
    name: 'Trance Loop',
    path: '/alise/trance-loop-81094.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 70,
  },
  {
    id: 'alise-trance-marie-louise',
    name: 'Trance Marie Louise',
    path: '/alise/trance-loop-marie-louise.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 70,
  },
  {
    id: 'alise-violin-loop',
    name: 'Violin Loop',
    path: '/alise/violin-loop.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'calm',
    price: 70,
  },
  {
    id: 'alise-shamu-theme',
    name: 'シャム Theme',
    path: '/alise/シャム%20~パイズリのテーマ~.mp3',
    animation: 'fast',
    category: 'other',
    type: 'music',
    mood: 'tokyo',
    price: 80,
  },
  {
    id: 'alise-suumo',
    name: 'スーモが過労死',
    path: '/alise/スーモが過労死.mp3',
    animation: 'fast',
    category: 'other',
    type: 'music',
    mood: 'happy',
    price: 80,
  },
];

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

const AKITO_BASE_SOUNDS: BaseSoundOption[] = [
  {
    id: 'akito-beat',
    name: 'Akito Beat',
    path: '/akito/akito-beat.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'tokyo',
    price: 50,
  },
  {
    id: 'akito-spring',
    name: 'Akito Spring',
    path: '/akito/akito-spring.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'tokyo',
    price: 50,
  },
  {
    id: 'akito-hard',
    name: 'Akito Hard',
    path: '/akito/akito-hard.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'powerful',
    price: 60,
  },
  {
    id: 'akito-loop',
    name: 'Akito Loop',
    path: '/akito/akito-loop.mp3',
    animation: 'slow',
    category: 'beats',
    type: 'beat',
    mood: 'cyberpunk',
    price: 50,
  },
  {
    id: 'akito-ritmo',
    name: 'Akito Ritmo',
    path: '/akito/akito-ritmo.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'tokyo',
    price: 50,
  },
  {
    id: 'akito-synth',
    name: 'Akito Synth',
    path: '/akito/akito-synth.mp3',
    animation: 'slow',
    category: 'melody',
    type: 'music',
    mood: 'cyberpunk',
    price: 60,
  },
  {
    id: 'akito-yokune',
    name: 'Akito Yokune',
    path: '/akito/Yokune.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-1',
    name: 'Akito Speaks 1',
    path: '/akito/akito-speaks1.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-2',
    name: 'Akito Speaks 2',
    path: '/akito/akito-speaks2.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-3',
    name: 'Akito Speaks 3',
    path: '/akito/akito-speaks3.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-4',
    name: 'Akito Speaks 4',
    path: '/akito/akito-speaks4.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-5',
    name: 'Akito Speaks 5',
    path: '/akito/akito-speaks5.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-speaks-6',
    name: 'Akito Speaks 6',
    path: '/akito/akito-speaks6.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-alise-speaks-7',
    name: 'Alise Speaks 7',
    path: '/akito/alise-speaks7.mp3',
    animation: 'slow',
    category: 'voice',
    type: 'voice',
    mood: 'tokyo',
    price: 40,
  },
  {
    id: 'akito-trap',
    name: 'Akito Trap',
    path: '/akito/akito-trap.mp3',
    animation: 'fast',
    category: 'beats',
    type: 'beat',
    mood: 'powerful',
    price: 60,
  },
  {
    id: 'akito-synth-garden',
    name: 'Akito Synth Garden',
    path: '/akito/synth%20garden.wav',
    animation: 'fast',
    category: 'calm',
    type: 'nature',
    mood: 'happy',
    price: 65,
  },
  {
    id: 'akito-synth-grow',
    name: 'Akito Synth Grow',
    path: '/akito/synth%20grow.wav',
    animation: 'fast',
    category: 'melody',
    type: 'music',
    mood: 'powerful',
    price: 75,
  },
  {
    id: 'akito-synth-night',
    name: 'Akito Synth Night',
    path: '/akito/synth%20night.mp3',
    animation: 'fast',
    category: 'calm',
    type: 'music',
    mood: 'tokyo',
    price: 85,
  },
];

export const ALL_SOUNDS = mapSoundColors([
  ...GUMI_BASE_SOUNDS,
  ...HANAKO_BASE_SOUNDS,
  ...AKITO_BASE_SOUNDS,
  ...ALISE_BASE_SOUNDS,
  ...LIBRARY_BASE_SOUNDS,
  ...PUBLIC_FOLDER_SOUNDS,
]);

export const SOUNDS = {
  gumi: mapSoundColors(GUMI_BASE_SOUNDS),
  hanako: mapSoundColors(HANAKO_BASE_SOUNDS),
  akito: mapSoundColors(AKITO_BASE_SOUNDS),
  alise: mapSoundColors(ALISE_BASE_SOUNDS),
  library: mapSoundColors([...LIBRARY_BASE_SOUNDS, ...PUBLIC_FOLDER_SOUNDS]),
  all: ALL_SOUNDS,
} as const;

export const CHARACTER_SOUND_FOLDER_IDS = ['akito', 'alise', 'gumi', 'hanako'] as const;
const CHARACTER_SOUND_FOLDER_ID_SET = new Set<string>(CHARACTER_SOUND_FOLDER_IDS);

export const getCharacterSoundPool = (characterId: string): SoundOption[] => {
  if (!CHARACTER_SOUND_FOLDER_ID_SET.has(characterId)) {
    return SOUNDS.library;
  }

  return SOUNDS[characterId as keyof Pick<typeof SOUNDS, 'akito' | 'alise' | 'gumi' | 'hanako'>];
};

export const getRandomCharacterSoundIds = (
  characterId: string,
  count = 7,
  excludedSoundIds: readonly string[] = [],
): string[] => {
  const pool = getCharacterSoundPool(characterId);
  const excluded = new Set(excludedSoundIds);
  const unselected = pool.filter((sound) => !excluded.has(sound.id));
  const source = unselected.length >= count ? unselected : pool;
  const shuffled = [...source];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count).map((sound) => sound.id);
};

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
    id: 'akito',
    name: 'AKITO',
    img: '/chars/akito-1.png',
    mixLabel: "Akito's Mix!",
    japaneseName: 'アキト', // @keep
    identityId: 'akito',
    titleColor: 'white',
    primaryColor: '#00b8d9',
    secondaryColor: '#ffb703',
    soundboardColor: '#062c3a',
    schemes: [
      {
        id: 'default',
        name: 'Signal Blue',
        titleColor: 'white',
        primaryColor: '#00b8d9',
        secondaryColor: '#ffb703',
        soundboardColor: '#062c3a',
      },
    ],
    sounds: SOUNDS.akito,
  },
  {
    id: 'alise',
    name: 'ALISE',
    img: '/chars/alise-lvl2-2.png',
    mixLabel: "Alise's Mix!",
    japaneseName: 'アリス', // @keep
    identityId: 'alise',
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
    sounds: SOUNDS.alise,
  },
  {
    id: 'foxy',
    name: 'FOXY',
    img: '/chars/foxy-1.png',
    mixLabel: "Foxy's Mix!",
    japaneseName: 'フォクシー', // @keep
    identityId: 'foxy',
    titleColor: 'white',
    primaryColor: '#ff9f1c',
    secondaryColor: '#e71d36',
    soundboardColor: '#3a1c1a',
    schemes: [
      {
        id: 'default',
        name: 'Wild Fire',
        titleColor: 'white',
        primaryColor: '#ff9f1c',
        secondaryColor: '#e71d36',
        soundboardColor: '#3a1c1a',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'gumi',
    name: 'GUMI (グミ)',
    img: '/chars/gumi-1.png',
    mixLabel: "Gumi's Mix!",
    japaneseName: 'グミ', // @keep
    identityId: 'gumi',
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
    sounds: SOUNDS.gumi,
  },
  {
    id: 'hanako',
    name: 'Hanako-kun (地縛少年花子くん)',
    img: '/chars/hanako-1.png',
    mixLabel: "Hanako's Mix!",
    japaneseName: '花子', // @keep
    identityId: 'hanako',
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
    sounds: SOUNDS.hanako,
  },
  {
    id: 'kagamine',
    name: 'KAGAMINE RIN',
    img: '/chars/kagamine-rin-1.png',
    mixLabel: "Rin's Mix!",
    japaneseName: '鏡音リン', // @keep
    identityId: 'kagamine',
    titleColor: 'white',
    primaryColor: '#f9d423',
    secondaryColor: '#fb8500',
    soundboardColor: '#3b2b10',
    schemes: [
      {
        id: 'default',
        name: 'Solar Flare',
        titleColor: 'white',
        primaryColor: '#f9d423',
        secondaryColor: '#fb8500',
        soundboardColor: '#3b2b10',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'honekoneko',
    name: 'HONEKONEKO',
    img: '/chars/honekoneko-1.png',
    mixLabel: "Boney Mix",
    japaneseName: 'ホネコネコ', // @keep
    identityId: 'honekoneko',
    titleColor: 'white',
    primaryColor: '#e5e5e5',
    secondaryColor: '#403d39',
    soundboardColor: '#252422',
    schemes: [
      {
        id: 'default',
        name: 'Bone White',
        titleColor: 'white',
        primaryColor: '#e5e5e5',
        secondaryColor: '#403d39',
        soundboardColor: '#252422',
      },
    ],
    sounds: ALL_SOUNDS,
  },
  {
    id: 'placeholder-1',
    name: 'Unknown',
    img: '/alise-1.svg',
    mixLabel: 'Unknown Mix',
    japaneseName: '不明', // @keep
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
    japaneseName: '透明', // @keep
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
    japaneseName: '隠し', // @keep
    titleColor: PLACEHOLDER_SCHEMES[2].titleColor,
    primaryColor: PLACEHOLDER_SCHEMES[2].primaryColor,
    secondaryColor: PLACEHOLDER_SCHEMES[2].secondaryColor,
    soundboardColor: PLACEHOLDER_SCHEMES[2].soundboardColor,
    schemes: PLACEHOLDER_SCHEMES,
    sounds: ALL_SOUNDS,
  },
  {
    id: 'placeholder-4',
    name: 'Ghost',
    img: '/alise-1.svg',
    mixLabel: 'Ghost Mix',
    japaneseName: '幽霊', // @keep
    titleColor: PLACEHOLDER_SCHEMES[3].titleColor,
    primaryColor: PLACEHOLDER_SCHEMES[3].primaryColor,
    secondaryColor: PLACEHOLDER_SCHEMES[3].secondaryColor,
    soundboardColor: PLACEHOLDER_SCHEMES[3].soundboardColor,
    schemes: PLACEHOLDER_SCHEMES,
    sounds: ALL_SOUNDS,
  },
];

export const CHARACTER_IMAGE_OPTIONS = [
  { id: 'placeholder', label: 'Custom', src: '/alise-1.svg' },
  { id: 'akito', label: 'Akito', src: '/chars/akito-1.png' },
  { id: 'alise', label: 'Alise', src: '/chars/alise-1.png' },
  { id: 'foxy', label: 'Foxy', src: '/chars/foxy-1.png' },
  { id: 'gumi', label: 'GUMI (グミ)', src: '/chars/gumi-1.png' },
  { id: 'hanako', label: 'Hanako-kun (地縛少年花子くん)', src: '/chars/hanako-1.png' },
  { id: 'kagamine', label: 'Kagamine Rin', src: '/chars/kagamine-rin-1.png' },
  { id: 'honekoneko', label: 'Honekoneko', src: '/chars/honekoneko-1.png' },
] as const;
