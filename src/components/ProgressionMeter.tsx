import styles from './ProgressionMeter.module.sass';
import type { ProgressionState, ProgressionLevel } from '../progression';

type ProgressionMeterProps = {
  state: ProgressionState;
  currentLevelInfo: ProgressionLevel;
  nextLevelInfo: ProgressionLevel | null;
};

export default function ProgressionMeter({ state, currentLevelInfo, nextLevelInfo }: ProgressionMeterProps) {
  if (!nextLevelInfo) {
    return (
      <div className={styles.progressionContainer}>
        <div className={styles.levelInfo}>
          <span>{currentLevelInfo.name}</span>
          <span className={styles.maxText}>MAX LEVEL REACHED</span>
        </div>
      </div>
    );
  }

  const reqs = nextLevelInfo.requirements;
  
  const meters = [];
  if (reqs.charactersPlayed) {
    meters.push({
      label: `CHARS ${state.playedCharacterIds.length}/${reqs.charactersPlayed}`,
      percent: Math.min(100, (state.playedCharacterIds.length / reqs.charactersPlayed) * 100),
    });
  }
  if (reqs.charactersCustomized) {
    meters.push({
      label: `CUSTOM ${state.customizedCharacterIds.length}/${reqs.charactersCustomized}`,
      percent: Math.min(100, (state.customizedCharacterIds.length / reqs.charactersCustomized) * 100),
    });
  }
  if (reqs.soundsPlayed) {
    meters.push({
      label: `SFX ${state.playedSoundIds.length}/${reqs.soundsPlayed}`,
      percent: Math.min(100, (state.playedSoundIds.length / reqs.soundsPlayed) * 100),
    });
  }
  if (reqs.minutesPlayed) {
    meters.push({
      label: `TIME ${state.minutesPlayed}/${reqs.minutesPlayed}m`,
      percent: Math.min(100, (state.minutesPlayed / reqs.minutesPlayed) * 100),
    });
  }

  // We display exactly 3 meters as requested
  const displayMeters = meters.slice(0, 3);

  return (
    <div className={styles.progressionContainer}>
      <div className={styles.levelInfo}>
        <span>{currentLevelInfo.name}</span>
        <span>NEXT: {nextLevelInfo.name}</span>
      </div>
      <div className={styles.meters}>
        {displayMeters.map((meter, idx) => (
          <div key={idx} className={styles.meterWrap}>
            <div className={styles.meterLabel}>{meter.label}</div>
            <div className={styles.meterTrack}>
              <div className={styles.meterFill} style={{ width: `${meter.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
