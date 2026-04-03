import React, { useMemo } from 'react';
import stylesConst from './ConstellationPicker.module.sass';
import stylesDeck from './MixerDeckPicker.module.sass';
import stylesSignal from './TokyoSignalPicker.module.sass';
import { Button, Chip } from '../../components-ui';
import { CHARACTERS, ALL_SOUNDS } from '../../config';

/**
 * CONCEPT 1: THE CONSTELLATION
 * Floating chips in a cloud around the character.
 */
export function ConstellationPickerMockup() {
  const character = CHARACTERS[0];
  const sampleSounds = ALL_SOUNDS.slice(0, 15);

  const constellationPositions = useMemo(() => {
    return sampleSounds.map(() => ({
      top: 20 + Math.random() * 60,
      left: 10 + Math.random() * 80,
    }));
  }, [sampleSounds]);

  return (
    <div className={stylesConst.container}>
      <img src={character.img} alt="" className={stylesConst.characterBg} />
      <div className={stylesConst.constellation}>
        {sampleSounds.map((s, i) => {
          const pos = constellationPositions[i];
          const isActive = i < 3;

          return (
            <Chip
              key={s.id}
              tone={isActive ? 'title' : 'neutral'}
              size="sm"
              className={stylesConst.floatingChip}
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                background: isActive ? `var(${s.colorToken})` : undefined,
                color: isActive ? '#000' : undefined
              } as React.CSSProperties}
            >
              {s.name}
            </Chip>
          );
        })}
      </div>
      <div className={stylesConst.bottomActions}>
        <Button variant="secondary" shape="pill">SHUFFLE CLOUD</Button>
        <Button variant="primary" shape="pill" className={stylesConst.applyButton}>APPLY MIX</Button>
      </div>
    </div>
  );
}

/**
 * CONCEPT 2: THE MIXER DECK
 * Physical slots for the 3-9 sound limit.
 */
export function MixerDeckPickerMockup() {
  const character = CHARACTERS[0];
  const deckSounds = ALL_SOUNDS.slice(5, 14);
  const slots = Array.from({ length: 9 });

  return (
    <div className={stylesDeck.container}>
      <aside className={stylesDeck.sideDrawer}>
        <h6>LIBRARY</h6>
        {ALL_SOUNDS.slice(0, 20).map(s => (
          <Chip key={s.id} tone="neutral" size="sm">{s.name}</Chip>
        ))}
      </aside>
      <main className={stylesDeck.mainStage}>
        <img src={character.img} alt="" className={stylesDeck.characterSilhouette} />
        <div className={stylesDeck.slotsGrid}>
          {slots.map((_, i) => {
            const sound = deckSounds[i];
            return (
              <div key={i} className={`${stylesDeck.slot} ${sound ? stylesDeck.slotActive : ''}`}>
                {sound ? (
                  <Chip
                    tone="title"
                    size="md"
                    font="goofy"
                    style={{ background: `var(${sound.colorToken})`, color: '#000' }}
                  >
                    {sound.name}
                  </Chip>
                ) : (
                  <span style={{ opacity: 0.2, fontSize: '0.7rem' }}>EMPTY SLOT</span>
                )}
              </div>
            );
          })}
        </div>
        <div className={stylesDeck.footer}>
          <Button variant="primary" shape="pill" size="lg">SAVE DECK</Button>
        </div>
      </main>
    </div>
  );
}

/**
 * CONCEPT 3: THE TOKYO SIGNAL
 * Radial rotation / Arcade style.
 */
export function TokyoSignalPickerMockup() {
  const character = CHARACTERS[0];
  const orbitSounds = ALL_SOUNDS.slice(10, 18);

  return (
    <div className={stylesSignal.container}>
      <div className={stylesSignal.radialCore}>
        <img src={character.img} alt="" className={stylesSignal.characterThumb} />
      </div>
      
      <div className={stylesSignal.orbit}>
        {orbitSounds.map((s, i) => {
          const angle = (i / orbitSounds.length) * 360;
          return (
            <div 
              key={s.id} 
              className={stylesSignal.orbitItem}
              style={{ transform: `rotate(${angle}deg) translate(250px) rotate(-${angle}deg)` }}
            >
              <Chip 
                tone="accent" 
                size="md"
                style={{ boxShadow: `0 0 15px var(${s.colorToken})`, border: `2px solid var(${s.colorToken})` }}
              >
                {s.name}
              </Chip>
            </div>
          );
        })}
      </div>

      <div className={stylesSignal.applyFab}>
        <Button variant="primary" shape="square" size="lg">OK</Button>
      </div>
    </div>
  );
}
