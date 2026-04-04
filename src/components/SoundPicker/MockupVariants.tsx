import React, { useMemo, useState } from 'react';
import stylesConst from './ConstellationPicker.module.sass';
import { Button, Chip, Meter, Popover, ListBox, ListBoxItem } from '../../components-ui';
import { CHARACTERS, ALL_SOUNDS } from '../../config';
import { DialogTrigger, Dialog } from 'react-aria-components';
import { Info, X } from 'lucide-react';

// Group sounds by category
type SoundCategory = 'beats' | 'voice' | 'drums' | 'creepy' | 'calm' | 'other' | 'melody' | 'animals';

const CATEGORY_LABELS: Record<SoundCategory, string> = {
  beats: 'Beats',
  voice: 'Voices',
  drums: 'Drums',
  creepy: 'Creepy',
  calm: 'Calm',
  other: 'Other',
  melody: 'Melody',
  animals: 'Animals',
};

/**
 * THE CONSTELLATION (UI MOCKUP v2.0)
 * Restored exact state from 18:30 screenshot.
 * Pure mockup, no live App.tsx state.
 */
export function ConstellationPickerMockup() {
  const character = CHARACTERS[0];
  const [shuffleKey, setShuffleKey] = useState(0);

  const ownedMockSounds = useMemo(() => ALL_SOUNDS.slice(0, 20), []);

  const activeMockSounds = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return [...ALL_SOUNDS]
      .sort((a, b) => pseudoRandom(a.id.length + shuffleKey) - pseudoRandom(b.id.length + shuffleKey))
      .slice(0, 8);
  }, [shuffleKey]);

  // Group sounds by category with varied sizes
  const groupedSounds = useMemo(() => {
    const groups: Record<string, typeof ALL_SOUNDS> = {};
    ownedMockSounds.forEach((sound) => {
      const category = sound.category as SoundCategory;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(sound);
    });

    // Vary category sizes: some get 1 item, some get 2-7
    const categorySizeMap: Record<string, number> = {
      beats: 6,
      voice: 5,
      drums: 1, // Just one item
      creepy: 4,
      calm: 2,
      other: 3,
    };

    return Object.entries(groups)
      .map(([key, sounds]) => {
        const size = categorySizeMap[key] || Math.min(sounds.length, 3);
        return {
          key: key as SoundCategory,
          label: CATEGORY_LABELS[key as SoundCategory] || key,
          sounds: sounds.slice(0, size),
        };
      })
      .filter((group) => group.sounds.length > 0);
  }, [ownedMockSounds]);

  const constellationData = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return activeMockSounds.map((s, i) => {
      const seed = i + shuffleKey * 13;
      const angle = pseudoRandom(seed) * 2 * Math.PI;
      const radius = 12 + pseudoRandom(seed + 1) * 28;
      const left = 50 + Math.cos(angle) * radius * 1.2;
      const top = 45 + Math.sin(angle) * radius;

      return {
        ...s,
        top,
        left,
        isActive: i < 3, // Mock 3 active slots
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
            {groupedSounds.map((group) => (
              <div key={group.key} className={stylesConst.libraryCategory}>
                <div className={stylesConst.categoryHeader}>{group.label}</div>
                <ListBox aria-label={`${group.label} sounds`} selectionMode="single">
                  {group.sounds.map((sound, index) => {
                    // Deterministic random based on sound ID and shuffleKey
                    const pseudoRandom = (id: string) => {
                      const x = Math.sin(id.length + index + shuffleKey) * 10000;
                      return x - Math.floor(x);
                    };
                    // ~30% of items are used, ensure first item in each category is used
                    const isUsed = index === 0 || pseudoRandom(sound.id) > 0.7;
                    return (
                      <ListBoxItem key={sound.id} id={sound.id} isUsed={isUsed}>
                        {sound.name}
                      </ListBoxItem>
                    );
                  })}
                </ListBox>
              </div>
            ))}
            <div className={stylesConst.getMoreContainer}>
              <Button variant="secondary" size="sm" className={stylesConst.getMoreBtn}>
                GET MORE SOUNDS
              </Button>
            </div>
          </div>
        </aside>

        <main className={stylesConst.mainArea}>
          <div className={stylesConst.mockupTitle}>
            <h3>ALISE'S CONSTELLATION</h3>
            <p>SOUNDS ON ALISE'S CARD</p>
          </div>

          <div className={stylesConst.headerActions}>
            <DialogTrigger>
              <Button variant="quiet" shape="square" size="sm" className={stylesConst.infoButton}>
                <Info size={24} />
              </Button>
              <Popover placement="bottom right">
                <Dialog className={stylesConst.infoDialog}>
                  <p>Tap a sound in the library to preview.</p>
                  <p>Use (+) to add to your character's mix.</p>
                  <p>Double-tap a floating sound to remove it.</p>
                </Dialog>
              </Popover>
            </DialogTrigger>
            <button className={stylesConst.mockupClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <img src={character.img} alt="" className={stylesConst.characterBg} />

          <div className={stylesConst.constellation}>
            {constellationData.map((s) => (
              <Chip
                key={s.id}
                tone={s.isActive ? 'title' : 'neutral'}
                size="sm"
                className={stylesConst.floatingChip}
                style={
                  {
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    background: s.isActive ? `var(${s.colorToken})` : undefined,
                    color: s.isActive ? '#000' : undefined,
                    opacity: s.isActive ? 1 : 0.4,
                  } as React.CSSProperties
                }
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
              <Button variant="secondary" shape="pill" onPress={() => setShuffleKey((k) => k + 1)}>
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
