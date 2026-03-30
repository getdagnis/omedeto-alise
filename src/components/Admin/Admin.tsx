import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faXmark, faCheck, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './Admin.module.sass';
import { ALL_SOUNDS } from '../../config';
import type { SoundOption } from '../../config';

type AdminProps = {
  isOpen: boolean;
  onClose: () => void;
  onPreviewSound: (soundId: string, path: string) => void;
  previewingSoundId: string | null;
};

export default function Admin({
  isOpen,
  onClose,
  onPreviewSound,
  previewingSoundId,
}: AdminProps) {
  // Local state for edits (since we don't have a backend yet, these are just for UI demo)
  const [soundEdits, setSoundEdits] = useState<Record<string, Partial<SoundOption>>>({});

  if (!isOpen) return null;

  return (
    <div className={styles.adminOverlay}>
      <div className={styles.adminCard}>
        <header className={styles.adminHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.adminTitle}>CATALOG ADMIN</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <div className={styles.catalogTableWrap}>
          <table className={styles.catalogTable}>
            <thead>
              <tr>
                <th>PREVIEW</th>
                <th>NAME</th>
                <th>TYPE</th>
                <th>MOOD</th>
                <th>PRICE (Y)</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {ALL_SOUNDS.map((sound) => {
                const isPreviewing = previewingSoundId === sound.id;
                const edits = soundEdits[sound.id] ?? {};

                return (
                  <tr key={sound.id}>
                    <td>
                      <button
                        className={`${styles.previewBtn} ${isPreviewing ? styles.previewing : ''}`}
                        onClick={() => onPreviewSound(sound.id, sound.path)}
                      >
                        <FontAwesomeIcon icon={faVolumeHigh} />
                      </button>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        defaultValue={edits.name ?? sound.name}
                        className={styles.inlineInput}
                        onChange={(e) => setSoundEdits(prev => ({ 
                          ...prev, 
                          [sound.id]: { ...prev[sound.id], name: e.target.value } 
                        }))}
                      />
                    </td>
                    <td>
                      <select 
                        defaultValue={sound.type}
                        className={styles.inlineSelect}
                      >
                        <option value="music">MUSIC</option>
                        <option value="sfx">SFX</option>
                        <option value="beat">BEAT</option>
                        <option value="voice">VOICE</option>
                        <option value="animal">ANIMAL</option>
                        <option value="nature">NATURE</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        defaultValue={sound.mood}
                        className={styles.inlineSelect}
                      >
                        <option value="happy">HAPPY</option>
                        <option value="calm">CALM</option>
                        <option value="energetic">ENERGETIC</option>
                        <option value="tokyo">TOKYO</option>
                        <option value="cyberpunk">CYBERPUNK</option>
                        <option value="creepy">CREEPY</option>
                        <option value="scary">SCARY</option>
                        <option value="powerful">POWERFUL</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        defaultValue={edits.price ?? sound.price}
                        className={styles.inlineInputSmall}
                        onChange={(e) => setSoundEdits(prev => ({ 
                          ...prev, 
                          [sound.id]: { ...prev[sound.id], price: parseInt(e.target.value) || 0 } 
                        }))}
                      />
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.saveBtn} title="Save Changes">
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button className={styles.deleteBtn} title="Delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button className={styles.resetBtn} title="Reset">
                          <FontAwesomeIcon icon={faRotateLeft} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
