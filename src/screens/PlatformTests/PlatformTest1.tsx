import React, { useState, type CSSProperties } from 'react';
import { ChevronLeft, UserRoundPen, Star, X, Plus, AudioLines, Heart as HeartSolid } from 'lucide-react';
import { Button, Chip } from '../../components-ui';
import { ALL_SOUNDS } from '../../config';
import styles from './PlatformTest1.module.sass';

export default function PlatformTest1({ onClose }: { onClose: () => void }) {
  const [activeRightPanel, setActiveRightPanel] = useState<'identity' | 'milestones' | null>(null);
  const [libTab, setLibTab] = useState<'favs' | 'cat' | 'mood' | 'chars'>('cat');

  // Use a slice of real sounds to demo the styles
  const demoSounds = ALL_SOUNDS.slice(0, 15);
  const activeSoundIds = ['fly-me', 'energy', 'synth-rise'];

  return (
    <div className={styles.workspace}>
      {/* Top Half: Stage */}
      <div className={styles.stageArea}>
        <header className={styles.topHeader}>
          <Button variant="quiet" size="sm" className={styles.backBtn} onPress={onClose}>
            <ChevronLeft size={16} style={{ marginRight: 4 }} /> BACK
          </Button>
          <div className={styles.topActions}>
            <button className={`${styles.iconBtn} ${activeRightPanel === 'identity' ? styles.active : ''}`} onClick={() => setActiveRightPanel('identity')}>
              <UserRoundPen size={18} />
            </button>
            <button className={`${styles.iconBtn} ${activeRightPanel === 'milestones' ? styles.active : ''}`} onClick={() => setActiveRightPanel('milestones')}>
              <Star size={18} />
            </button>
          </div>
        </header>

        <main className={styles.stageContent}>
          <img src="/chars/gumi-cyber-1.png" alt="Gumi Cyber" className={styles.hologram} />
          <div className={styles.constellationOverlay}>
            <Chip tone="accent" size="md" className={styles.node} style={{ top: '30%', left: '40%' } as CSSProperties}>SYNTH RISE</Chip>
            <Chip tone="title" size="md" className={styles.node} style={{ top: '60%', left: '55%' } as CSSProperties}>FLY ME</Chip>
            <Chip tone="neutral" size="md" className={styles.node} style={{ top: '45%', left: '70%' } as CSSProperties}>ENERGY</Chip>
          </div>
        </main>
      </div>

      {/* Bottom Half: The Integrated Sound Library */}
      <div className={styles.libraryPanel}>
        <div className={styles.libraryHeader}>
          <div className={styles.libraryHandle} />
          <h6 className={styles.libraryTitle}>SOUND LIBRARY</h6>
          <div className={styles.libTabs}>
            <button className={`${styles.libTab} ${libTab === 'favs' ? styles.libTabActive : ''}`} onClick={() => setLibTab('favs')}>FAVS</button>
            <button className={`${styles.libTab} ${libTab === 'cat' ? styles.libTabActive : ''}`} onClick={() => setLibTab('cat')}>CAT</button>
            <button className={`${styles.libTab} ${libTab === 'mood' ? styles.libTabActive : ''}`} onClick={() => setLibTab('mood')}>MOOD</button>
            <button className={`${styles.libTab} ${libTab === 'chars' ? styles.libTabActive : ''}`} onClick={() => setLibTab('chars')}>CHARS</button>
          </div>
        </div>

        <div className={styles.libraryList}>
          {demoSounds.map(sound => {
            const isActive = activeSoundIds.includes(sound.id);
            return (
              <div key={sound.id} className={`${styles.libraryItemRow} ${isActive ? styles.itemInCloud : ''}`}>
                <button className={`${styles.libraryItem} ${isActive ? styles.libraryItemActive : ''}`}>
                  <div className={styles.libraryItemDot} style={{ background: `var(${sound.colorToken})` }}>
                    <AudioLines size={8} className={styles.dotIcon} />
                  </div>
                  <span className={styles.libraryItemName}>{sound.name.toUpperCase()}</span>
                  <div className={styles.libraryItemActions}>
                    {isActive ? <X size={14} className={styles.libActionIcon} /> : <Plus size={14} className={styles.libActionIcon} />}
                  </div>
                </button>
                <button className={`${styles.favBtn} ${sound.id === 'fly-me' ? styles.favBtnActive : ''}`}>
                  <HeartSolid size={14} fill={sound.id === 'fly-me' ? 'currentColor' : 'none'} />
                </button>
              </div>
            );
          })}
        </div>
        
        <div className={styles.bottomApplyBar}>
          <Button variant="primary" size="lg" className={styles.applyBtn}>APPLY TO STAGE</Button>
        </div>
      </div>

      {/* Slide-out Drawer (Identity/Milestones) */}
      <div className={`${styles.drawer} ${activeRightPanel ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h3>{activeRightPanel?.toUpperCase()}</h3>
          <button className={styles.closeDrawerBtn} onClick={() => setActiveRightPanel(null)}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.drawerContent}>
          {activeRightPanel === 'identity' && (
            <div className={styles.mockIdentity}>
              <p>Hardware Updates</p>
              <div className={styles.mockCard}><img src="/chars/foxy-1.png" alt="Foxy" /></div>
              <div className={styles.mockCard}><img src="/chars/alise-lvl3-1.png" alt="Alise" /></div>
            </div>
          )}
          {activeRightPanel === 'milestones' && (
            <div className={styles.mockMilestones}>
              <p>Combo Discoveries</p>
              <div className={styles.mockCard}>Cyber Pulse - 100%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}