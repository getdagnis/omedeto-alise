import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faXmark, faCartShopping, faCoins, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './Shop.module.sass';
import { ALL_SOUNDS } from '../../config';
import type { SoundType, SoundMood } from '../../config';

type ShopProps = {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  currencySymbol: string;
  ownedSoundIds: string[];
  onBuySound: (soundId: string, price: number) => void;
  onPreviewSound: (soundId: string, path: string) => void;
  previewingSoundId: string | null;
};

const SOUND_TYPES: (SoundType | 'all')[] = ['all', 'music', 'sfx', 'beat', 'voice', 'animal', 'nature'];
const SOUND_MOODS: (SoundMood | 'all')[] = [
  'all',
  'creepy',
  'happy',
  'calm',
  'scary',
  'energetic',
  'powerful',
  'tokyo',
  'cyberpunk',
  'other',
];

export default function Shop({
  isOpen,
  onClose,
  walletBalance,
  currencySymbol,
  ownedSoundIds,
  onBuySound,
  onPreviewSound,
  previewingSoundId,
}: ShopProps) {
  const [activeType, setActiveType] = useState<SoundType | 'all'>('all');
  const [activeMood, setActiveMood] = useState<SoundMood | 'all'>('all');

  const filteredSounds = useMemo(() => {
    return ALL_SOUNDS.filter((s) => {
      const typeMatch = activeType === 'all' || s.type === activeType;
      const moodMatch = activeMood === 'all' || s.mood === activeMood;
      return typeMatch && moodMatch;
    });
  }, [activeType, activeMood]);

  if (!isOpen) return null;

  return (
    <div className={styles.shopOverlay}>
      <div className={styles.shopCard}>
        <header className={styles.shopHeader}>
          <div className={styles.headerLeft}>
            <FontAwesomeIcon icon={faCartShopping} className={styles.shopIcon} />
            <h2 className={styles.shopTitle}>SOUND MARKETPLACE</h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.wallet}>
              <FontAwesomeIcon icon={faCoins} className={styles.coinIcon} />
              <span>
                {walletBalance}
                {currencySymbol}
              </span>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </header>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>TYPE</span>
            <div className={styles.filterBar}>
              {SOUND_TYPES.map((t) => (
                <button
                  key={t}
                  className={`${styles.filterButton} ${activeType === t ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>MOOD</span>
            <div className={styles.filterBar}>
              {SOUND_MOODS.map((m) => (
                <button
                  key={m}
                  className={`${styles.filterButton} ${activeMood === m ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveMood(m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.marketGrid}>
          {filteredSounds.map((sound) => {
            const isOwned = ownedSoundIds.includes(sound.id);
            const isPreviewing = previewingSoundId === sound.id;
            const canAfford = walletBalance >= sound.price;

            return (
              <div key={sound.id} className={`${styles.marketItem} ${isOwned ? styles.itemOwned : ''}`}>
                <button
                  className={`${styles.previewBtn} ${isPreviewing ? styles.previewing : ''}`}
                  onClick={() => onPreviewSound(sound.id, sound.path)}
                >
                  <FontAwesomeIcon icon={faVolumeHigh} />
                </button>

                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{sound.name.toUpperCase()}</span>
                  <div className={styles.itemTags}>
                    <span>{sound.type}</span>
                    <span>{sound.mood}</span>
                  </div>
                </div>

                <button
                  className={`${styles.buyBtn} ${isOwned ? styles.buyBtnOwned : ''}`}
                  disabled={isOwned || !canAfford}
                  onClick={() => onBuySound(sound.id, sound.price)}
                >
                  {isOwned ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} /> OWNED
                    </>
                  ) : (
                    `${sound.price}Y`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
