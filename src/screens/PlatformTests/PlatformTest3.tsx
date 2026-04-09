import React, { useState } from 'react';
import { ChevronLeft, Play, Pause, ChevronRight, AudioLines, Heart as HeartSolid, Music } from 'lucide-react';
import { Button } from '../../components-ui';
import { ALL_SOUNDS } from '../../config';
import styles from './PlatformTest3.module.sass';

export default function PlatformTest3({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [libTab, setLibTab] = useState<'favs' | 'cat' | 'mood' | 'chars'>('cat');

  // Use real sounds for the rack
  const rackSounds = ALL_SOUNDS.slice(10, 25);

  return (
    <div className={styles.mixDesk}>
      {/* Top Visualizer / Stage (50vh) */}
      <div className={styles.visualizerArea}>
        <header className={styles.topHeader}>
          <Button variant="quiet" size="sm" className={styles.backBtn} onPress={onClose}>
            <ChevronLeft size={16} style={{ marginRight: 4 }} /> BACK
          </Button>
          <div className={styles.charHeader}>
            <h1>KAGAMINE RIN</h1>
          </div>
        </header>
        
        <div className={styles.stageContent}>
          <img src="/chars/kagamine-rin-2.png" alt="Rin" className={styles.stageChar} />
          
          {/* Rotating Constellation */}
          <div className={`${styles.recordConstellation} ${isPlaying ? styles.spinning : ''}`}>
            <div className={styles.ring1}></div>
            <div className={styles.ring2}></div>
            
            <div className={styles.node} style={{ top: '15%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-primary-600)' }}>KICK 1</div>
            <div className={styles.node} style={{ top: '75%', left: '25%', transform: 'translate(-50%, -50%)', background: 'var(--color-secondary-600)' }}>SYNTH GARDEN</div>
            <div className={styles.node} style={{ top: '75%', left: '75%', transform: 'translate(-50%, -50%)', background: 'var(--color-title)' }}>ALIEN</div>
          </div>
        </div>
      </div>

      {/* Bottom Sound Rack (50vh) */}
      <div className={styles.soundRackArea}>
        {/* Horizontal Library Tabs */}
        <div className={styles.libraryHeader}>
          <h6 className={styles.libraryTitle}><Music size={12} style={{ marginRight: 6 }} /> RACK LIBRARY</h6>
          <div className={styles.libTabs}>
            <button className={`${styles.libTab} ${libTab === 'favs' ? styles.libTabActive : ''}`} onClick={() => setLibTab('favs')}>FAVS</button>
            <button className={`${styles.libTab} ${libTab === 'cat' ? styles.libTabActive : ''}`} onClick={() => setLibTab('cat')}>CAT</button>
            <button className={`${styles.libTab} ${libTab === 'mood' ? styles.libTabActive : ''}`} onClick={() => setLibTab('mood')}>MOOD</button>
            <button className={`${styles.libTab} ${libTab === 'chars' ? styles.libTabActive : ''}`} onClick={() => setLibTab('chars')}>CHARS</button>
          </div>
        </div>

        {/* Horizontal Swiping Rack (Integrating existing library item styles) */}
        <div className={styles.rackScroll}>
          {rackSounds.map((sound, index) => {
            const isActive = index % 4 === 0; // Fake some active states
            const isFav = index === 2;
            return (
              <div key={sound.id} className={`${styles.cartridge} ${isActive ? styles.cartridgeActive : ''}`}>
                <div className={styles.cartridgeTop}>
                  <div className={styles.libraryItemDot} style={{ background: `var(${sound.colorToken})` }}>
                     <AudioLines size={12} className={styles.dotIcon} />
                  </div>
                  <button className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`}>
                    <HeartSolid size={14} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className={styles.cartridgeBody}>
                  <span className={styles.cartName}>{sound.name.toUpperCase()}</span>
                  <div className={styles.cartGrips}>
                    <div className={styles.cartGrip}></div>
                    <div className={styles.cartGrip}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Footer */}
        <div className={styles.masterControl}>
          <div className={styles.masterInfo}>
            <span>MIX CAPACITY</span>
            <div className={styles.slotsWrap}>
              <div className={`${styles.slot} ${styles.slotFull}`}>X</div>
              <div className={`${styles.slot} ${styles.slotFull}`}>X</div>
              <div className={`${styles.slot} ${styles.slotFull}`}>X</div>
              <div className={styles.slot}></div>
              <div className={styles.slot}></div>
              <div className={styles.slot}></div>
            </div>
          </div>
          
          <div className={styles.actionRow}>
             <button className={styles.playIconBtn} onClick={() => setIsPlaying(!isPlaying)}>
               {isPlaying ? <Pause size={24} /> : <Play size={24} />}
             </button>
             <Button variant="primary" size="lg" className={styles.ejectBtn}>
               EJECT & PLAY <ChevronRight size={18} style={{ marginLeft: 8 }} />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}