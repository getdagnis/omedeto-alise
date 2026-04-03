import React, { useMemo, useState } from 'react';
import stylesConst from './ConstellationPicker.module.sass';
import { Button, Chip, Meter, Popover } from '../../components-ui';
import { CHARACTERS, ALL_SOUNDS } from '../../config';
import { DialogTrigger, Dialog } from 'react-aria-components';

/**
 * THE CONSTELLATION (UI MOCKUP v2.0)
 * Restored exact state from 18:30 screenshot.
 * Pure mockup, no live App.tsx state.
 */
export function ConstellationPickerMockup() {
  const character = CHARACTERS[0];
  const [shuffleKey, setShuffleKey] = useState(0);

  const ownedMockSounds = useMemo(() => ALL_SOUNDS.slice(0, 15), []);
  
  const activeMockSounds = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return [...ALL_SOUNDS].sort((a, b) => 
      pseudoRandom(a.id.length + shuffleKey) - pseudoRandom(b.id.length + shuffleKey)
    ).slice(0, 8);
  }, [shuffleKey]);

  const constellationData = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return activeMockSounds.map((s, i) => {
      const seed = i + (shuffleKey * 13);
      const angle = pseudoRandom(seed) * 2 * Math.PI;
      const radius = 12 + pseudoRandom(seed + 1) * 28;
      const left = 50 + Math.cos(angle) * radius * 1.2;
      const top = 45 + Math.sin(angle) * radius;

      return {
        ...s,
        top,
        left,
        isActive: i < 3 // Mock 3 active slots
      };
    });
  }, [activeMockSounds, shuffleKey]);

  return (
    <div className={stylesConst.mockupWrapper}>
      <div className={stylesConst.container}>
        
        <aside className={stylesConst.librarySidebar}>
          <div className={stylesConst.libraryHeader}>
            <h6>YOUR LIBRARY</h6>
          </div>
          <div className={stylesConst.libraryList}>
            {ownedMockSounds.map(s => {
              const isInCloud = activeMockSounds.some(am => am.id === s.id);
              return (
                <div key={s.id} className={`${stylesConst.libraryItem} ${isInCloud ? stylesConst.itemActive : ''}`}>
                  <Chip tone="neutral" size="sm" className={stylesConst.libraryChip}>
                    {s.name}
                  </Chip>
                  <Button variant="quiet" size="sm" shape="square">
                    {isInCloud ? '-' : '+'}
                  </Button>
                </div>
              );
            })}
            <div style={{ padding: '0 0.5rem' }}>
              <Button variant="secondary" size="sm" className={stylesConst.getMoreBtn}>
                GET MORE SOUNDS
              </Button>
            </div>
          </div>
        </aside>

        <main className={stylesConst.mainArea}>
          <div className={stylesConst.mockupTitle}>
            <h3>SOUND PICKER</h3>
            <p>CONSTELLATION v2.0</p>
          </div>

          <div className={stylesConst.headerActions}>
            <button className={stylesConst.mockupClose} aria-label="Close">✕</button>
            <DialogTrigger>
              <Button variant="quiet" shape="square" size="sm" className={stylesConst.infoButton}>
                (i)
              </Button>
              <Popover placement="bottom right">
                <Dialog className={stylesConst.infoDialog}>
                  <p>Tap a sound in the library to preview.</p>
                  <p>Use (+) to add to your character's mix.</p>
                  <p>Double-tap a floating sound to remove it.</p>
                </Dialog>
              </Popover>
            </DialogTrigger>
          </div>

          <img src={character.img} alt="" className={stylesConst.characterBg} />

          <div className={stylesConst.constellation}>
            {constellationData.map((s) => (
              <Chip
                key={s.id}
                tone={s.isActive ? 'title' : 'neutral'}
                size="sm"
                className={stylesConst.floatingChip}
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  background: s.isActive ? `var(${s.colorToken})` : undefined,
                  color: s.isActive ? '#000' : undefined,
                  opacity: s.isActive ? 1 : 0.4
                } as React.CSSProperties}
              >
                {s.name}
              </Chip>
            ))}
          </div>

          <div className={stylesConst.bottomActions}>
            <Meter 
              label="Capacity" 
              value={(activeMockSounds.length / 9) * 100} 
              valueLabel={`${activeMockSounds.length} / 9`}
            />
            <div className={stylesConst.actionButtons}>
              <Button variant="secondary" shape="pill" onPress={() => setShuffleKey(k => k + 1)}>
                SHUFFLE CLOUD
              </Button>
              <Button variant="primary" shape="pill" className={stylesConst.applyButton}>
                APPLY MIX
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
