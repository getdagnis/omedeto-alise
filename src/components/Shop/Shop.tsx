import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faCartShopping, faCoins, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './Shop.module.sass';
import { ALL_SOUNDS } from '../../config';
import type { SoundType, SoundMood } from '../../config';
import { Button, Chip, CloseButton, ToggleButton } from '../../components-ui';
import { useAnalytics } from '../../hooks/useAnalytics';

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
  const { trackEvent } = useAnalytics();

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
            <CloseButton className={styles.closeButton} onPress={onClose} aria-label="Close shop" />
          </div>
        </header>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>TYPE</span>
            <div className={styles.filterBar}>
              {SOUND_TYPES.map((t) => (
                <ToggleButton
                  key={t}
                  className={styles.filterButton}
                  variant="secondary"
                  size="sm"
                  shape="pill"
                  isSelected={activeType === t}
                  onChange={() => setActiveType(t)}
                >
                  {t.toUpperCase()}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>MOOD</span>
            <div className={styles.filterBar}>
              {SOUND_MOODS.map((m) => (
                <ToggleButton
                  key={m}
                  className={styles.filterButton}
                  variant="secondary"
                  size="sm"
                  shape="pill"
                  isSelected={activeMood === m}
                  onChange={() => setActiveMood(m)}
                >
                  {m.toUpperCase()}
                </ToggleButton>
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
                <Button
                  className={`${styles.previewBtn} ${isPreviewing ? styles.previewing : ''}`}
                  variant="secondary"
                  size="md"
                  shape="square"
                  onPress={() => {
                    trackEvent('sound_preview', { sound_id: sound.id });
                    onPreviewSound(sound.id, sound.path);
                  }}
                  aria-label={isPreviewing ? 'Stop preview' : `Preview ${sound.name}`}
                >
                  <FontAwesomeIcon icon={faVolumeHigh} />
                </Button>

                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{sound.name.toUpperCase()}</span>
                  <div className={styles.itemTags}>
                    <Chip tone="neutral" size="sm">
                      {sound.type}
                    </Chip>
                    <Chip tone="accent" size="sm">
                      {sound.mood}
                    </Chip>
                  </div>
                </div>

                <Button
                  className={`${styles.buyBtn} ${isOwned ? styles.buyBtnOwned : ''}`}
                  variant={isOwned ? 'secondary' : 'primary'}
                  size="sm"
                  shape="pill"
                  isDisabled={isOwned || !canAfford}
                  onPress={() => {
                    trackEvent('sound_purchased', { sound_id: sound.id, category: sound.price.toString() });
                    onBuySound(sound.id, sound.price);
                  }}
                >
                  {isOwned ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} /> OWNED
                    </>
                  ) : (
                    `${sound.price}Y`
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
