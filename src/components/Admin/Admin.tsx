import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import styles from './Admin.module.sass';
import { ALL_SOUNDS } from '../../config';
import type { SoundMood, SoundType } from '../../config';
import { Chip } from '../../components-ui';

type ReviewStatus = 'pending' | 'approved' | 'maybe' | 'trashed';

type SoundReviewState = {
  name: string;
  type: SoundType;
  mood: SoundMood;
  price: number;
  notes: string;
  status: ReviewStatus;
};

type AdminProps = {
  onPreviewSound: (soundId: string, path: string) => void;
  previewingSoundId: string | null;
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  maybe: 'Maybe',
  trashed: 'Trashed',
};

const SOUND_TYPES: SoundType[] = ['music', 'sfx', 'beat', 'voice', 'animal', 'nature'];
const SOUND_MOODS: SoundMood[] = ['creepy', 'happy', 'calm', 'scary', 'energetic', 'powerful', 'tokyo', 'cyberpunk', 'other'];

const createInitialReviewState = (): Record<string, SoundReviewState> =>
  Object.fromEntries(
    ALL_SOUNDS.map((sound) => [
      sound.id,
      {
        name: sound.name,
        type: sound.type,
        mood: sound.mood,
        price: sound.price,
        notes: '',
        status: 'pending' as ReviewStatus,
      },
    ]),
  );

export default function Admin({ onPreviewSound, previewingSoundId }: AdminProps) {
  const [reviewById, setReviewById] = useState<Record<string, SoundReviewState>>(() => createInitialReviewState());
  const [expandedId, setExpandedId] = useState<string | null>(ALL_SOUNDS[0]?.id ?? null);
  const [visibleBucket, setVisibleBucket] = useState<'all' | ReviewStatus>('all');

  const counts = useMemo(() => {
    const next = { pending: 0, approved: 0, maybe: 0, trashed: 0 };
    Object.values(reviewById).forEach((item) => {
      next[item.status] += 1;
    });
    return next;
  }, [reviewById]);

  const visibleSounds = useMemo(() => {
    return ALL_SOUNDS.filter((sound) => visibleBucket === 'all' || reviewById[sound.id]?.status === visibleBucket);
  }, [reviewById, visibleBucket]);

  const setStatus = (soundId: string, status: ReviewStatus) => {
    setReviewById((prev) => ({
      ...prev,
      [soundId]: { ...prev[soundId], status },
    }));
  };

  const updateField = <K extends keyof SoundReviewState>(soundId: string, key: K, value: SoundReviewState[K]) => {
    setReviewById((prev) => ({
      ...prev,
      [soundId]: { ...prev[soundId], [key]: value },
    }));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Internal Review</p>
          <h1 className={styles.title}>Sound Catalog Admin</h1>
        </div>
      </header>

      <section className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.bucketButton} ${visibleBucket === 'all' ? styles.bucketButtonActive : ''}`}
          onClick={() => setVisibleBucket('all')}
        >
          All
          <span>{ALL_SOUNDS.length}</span>
        </button>
        {(['pending', 'approved', 'maybe', 'trashed'] as ReviewStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            className={`${styles.bucketButton} ${visibleBucket === status ? styles.bucketButtonActive : ''}`}
            onClick={() => setVisibleBucket(status)}
          >
            {STATUS_LABELS[status]}
            <span>{counts[status]}</span>
          </button>
        ))}
      </section>

      <section className={styles.list}>
        {visibleSounds.map((sound) => {
          const review = reviewById[sound.id];
          const isPreviewing = previewingSoundId === sound.id;
          const isExpanded = expandedId === sound.id;

          return (
            <article key={sound.id} className={styles.item}>
              <div className={styles.itemTopRow}>
                <div className={styles.itemLead}>
                  <button
                    type="button"
                    className={`${styles.previewButton} ${isPreviewing ? styles.previewButtonActive : ''}`}
                    onClick={() => onPreviewSound(sound.id, sound.path)}
                    aria-label={isPreviewing ? `Stop preview ${review.name}` : `Preview ${review.name}`}
                  >
                    <FontAwesomeIcon icon={faVolumeHigh} />
                  </button>

                  <div className={styles.itemMeta}>
                    <div className={styles.itemNameRow}>
                      <strong className={styles.itemName}>{review.name}</strong>
                      <Chip tone={review.status === 'approved' ? 'success' : review.status === 'trashed' ? 'danger' : review.status === 'maybe' ? 'accent' : 'neutral'}>
                        {STATUS_LABELS[review.status]}
                      </Chip>
                    </div>
                    <div className={styles.itemTags}>
                      <Chip>{review.type}</Chip>
                      <Chip tone="accent">{review.mood}</Chip>
                      <Chip>{review.price}Y</Chip>
                    </div>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={review.status === 'approved'}
                      onChange={(event) => setStatus(sound.id, event.target.checked ? 'approved' : 'pending')}
                    />
                    <span>OK</span>
                  </label>
                  <button type="button" className={styles.statusButton} onClick={() => setStatus(sound.id, 'maybe')}>
                    Maybe
                  </button>
                  <button type="button" className={styles.statusButton} onClick={() => setStatus(sound.id, 'trashed')}>
                    Nah
                  </button>
                  <button
                    type="button"
                    className={styles.expandButton}
                    onClick={() => setExpandedId((prev) => (prev === sound.id ? null : sound.id))}
                    aria-expanded={isExpanded}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className={isExpanded ? styles.expandIconOpen : styles.expandIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.itemBottomRow}>
                <span className={styles.filePath}>{sound.path}</span>
              </div>

              {isExpanded && (
                <div className={styles.expanded}>
                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      <span>Name</span>
                      <input
                        type="text"
                        value={review.name}
                        onChange={(event) => updateField(sound.id, 'name', event.target.value)}
                      />
                    </label>

                    <label className={styles.field}>
                      <span>Type</span>
                      <select
                        value={review.type}
                        onChange={(event) => updateField(sound.id, 'type', event.target.value as SoundType)}
                      >
                        {SOUND_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field}>
                      <span>Mood</span>
                      <select
                        value={review.mood}
                        onChange={(event) => updateField(sound.id, 'mood', event.target.value as SoundMood)}
                      >
                        {SOUND_MOODS.map((mood) => (
                          <option key={mood} value={mood}>
                            {mood}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field}>
                      <span>Price</span>
                      <input
                        type="number"
                        value={review.price}
                        onChange={(event) => updateField(sound.id, 'price', Number(event.target.value) || 0)}
                      />
                    </label>
                  </div>

                  <label className={`${styles.field} ${styles.notesField}`}>
                    <span>Notes</span>
                    <textarea
                      rows={3}
                      value={review.notes}
                      onChange={(event) => updateField(sound.id, 'notes', event.target.value)}
                    />
                  </label>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
