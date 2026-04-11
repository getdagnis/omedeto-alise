import React, { useState } from 'react';
import { ChevronLeft, Volume2, Gamepad2, ListVideo, Sparkles } from 'lucide-react';
import styles from './PlatformTest2.module.sass';

export default function PlatformTest2({ onClose }: { onClose: () => void }) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const sounds = [
    { icon: Volume2, name: 'Synth Rise', top: '25%', left: '30%' },
    { icon: Sparkles, name: 'Fly Me', top: '40%', left: '15%' },
    { icon: Gamepad2, name: 'Machines', top: '65%', left: '20%' },
  ];

  return (
    <div className={styles.heroScreen}>
      {/* Background & Character */}
      <div className={styles.heroBackground}>
        <img src="/chars/hanako-kun-4.png" alt="Hanako Kun" className={styles.heroImage} />
        <div className={styles.gradientOverlay} />
      </div>

      {/* Top Bar */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={onClose}>
          <ChevronLeft size={20} /> Back
        </button>
        <div className={styles.charInfo}>
          <h1>HANAKO KUN</h1>
          <p>Lv. 4 Entity</p>
        </div>
        <div className={styles.topActions}>
          <button>IDENTITY</button>
          <button>MILESTONES</button>
        </div>
      </header>

      {/* Icon-heavy Minimal Soundbar (Left) */}
      <nav className={styles.iconNav}>
        {['VOICE', 'BEATS', 'DRUMS', 'CREEPY'].map((cat, i) => (
          <div 
            key={i} 
            className={styles.navItem}
            onMouseEnter={() => setHoveredIcon(cat)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <div className={styles.iconWrap}>
              <ListVideo size={20} />
            </div>
            <span className={`${styles.navLabel} ${hoveredIcon === cat ? styles.labelVisible : ''}`}>
              {cat}
            </span>
          </div>
        ))}
      </nav>

      {/* Hero Constellation (Anchored to Character) */}
      <div className={styles.heroConstellation}>
        {sounds.map((sound, i) => (
          <div key={i} className={styles.heroNode} style={{ top: sound.top, left: sound.left }}>
            <sound.icon size={14} className={styles.nodeIcon} />
            <span className={styles.nodeName}>{sound.name}</span>
            <div className={styles.connectionLine} />
          </div>
        ))}
      </div>

      {/* Bottom Apply */}
      <footer className={styles.bottomBar}>
        <div className={styles.petCompanion}>
          <img src="/chars/grumpi-1.png" alt="Grumpi" className={styles.petImage} />
          <span>Grumpi is listening...</span>
        </div>
        <button className={styles.playBtn}>APPLY MIX</button>
      </footer>
    </div>
  );
}