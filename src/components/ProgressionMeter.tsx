import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faLock, faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import styles from './ProgressionMeter.module.sass';
import type { ProgressionState, ProgressionLevel } from '../progression';
import { PROGRESSION_LEVELS } from '../progression';

type ProgressionMeterProps = {
  state: ProgressionState;
  currentLevelInfo: ProgressionLevel;
  nextLevelInfo: ProgressionLevel | null;
};

export default function ProgressionMeter({ state, currentLevelInfo, nextLevelInfo }: ProgressionMeterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMetersForLevel = (level: ProgressionLevel) => {
    const reqs = level.requirements;
    const meters = [];
    if (reqs.charactersPlayed) {
      meters.push({
        label: `CHARS`,
        value: `${state.playedCharacterIds.length}/${reqs.charactersPlayed}`,
        percent: Math.min(100, (state.playedCharacterIds.length / reqs.charactersPlayed) * 100),
      });
    }
    if (reqs.charactersCustomized) {
      meters.push({
        label: `CUSTOM`,
        value: `${state.customizedCharacterIds.length}/${reqs.charactersCustomized}`,
        percent: Math.min(100, (state.customizedCharacterIds.length / reqs.charactersCustomized) * 100),
      });
    }
    if (reqs.soundsPlayed) {
      meters.push({
        label: `SFX`,
        value: `${state.playedSoundIds.length}/${reqs.soundsPlayed}`,
        percent: Math.min(100, (state.playedSoundIds.length / reqs.soundsPlayed) * 100),
      });
    }
    if (reqs.minutesPlayed) {
      meters.push({
        label: `TIME`,
        value: `${state.minutesPlayed}/${reqs.minutesPlayed}m`,
        percent: Math.min(100, (state.minutesPlayed / reqs.minutesPlayed) * 100),
      });
    }
    return meters;
  };

  const currentMeters = nextLevelInfo ? getMetersForLevel(nextLevelInfo).slice(0, 3) : [];

  if (isExpanded) {
    return (
      <>
        <div className={styles.overlay} onClick={() => setIsExpanded(false)} />
        <div className={styles.expandedPanel}>
          <header className={styles.expandedHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              <h2>ULTRA MODE CHALLENGE</h2>
            </div>
            <button className={styles.closeButton} onClick={() => setIsExpanded(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </header>

          <div className={styles.levelList}>
            {PROGRESSION_LEVELS.map((level) => {
              const isCleared = state.unlockedLevel > level.level || (level.level === 0 && state.unlockedLevel > 0);
              const isActive = (nextLevelInfo?.level === level.level) || (nextLevelInfo === null && level.level === PROGRESSION_LEVELS.length - 1);
              const isLocked = !isCleared && !isActive;

              return (
                <div 
                  key={level.level} 
                  className={`${styles.levelCard} ${isCleared ? styles.levelCleared : ''} ${isActive ? styles.levelActive : ''} ${isLocked ? styles.levelLocked : ''}`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.levelBadge}>
                      {isCleared ? <FontAwesomeIcon icon={faCheck} /> : level.level}
                    </div>
                    <div className={styles.levelMainInfo}>
                      <h3>{level.name.toUpperCase()}</h3>
                      {!isCleared && <p className={styles.levelDesc}>{level.description}</p>}
                    </div>
                    {isLocked && <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />}
                    {isCleared && <span className={styles.clearedTag}>CLEARED</span>}
                  </div>

                  {isActive && (
                    <>
                      <div className={styles.benefitBox}>
                        <span className={styles.benefitIcon}>{level.benefitIcon}</span>
                        <div className={styles.benefitText}>
                          <strong>{level.benefitTitle}</strong>
                          <span>{level.benefitDetail}</span>
                        </div>
                      </div>
                      <div className={styles.activeProgress}>
                        {getMetersForLevel(level).map((m, idx) => (
                          <div key={idx} className={styles.detailedMeter}>
                            <div className={styles.detailedLabels}>
                              <span>{m.label}</span>
                              <span>{m.value}</span>
                            </div>
                            <div className={styles.detailedTrack}>
                              <div className={styles.detailedFill} style={{ width: `${m.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {isLocked && (
                    <div className={styles.lockedBenefit}>
                      <FontAwesomeIcon icon={faLock} />
                      <span>Unlock {level.benefitTitle}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.progressionContainer} onClick={() => setIsExpanded(true)} role="button" tabIndex={0}>
      <div className={styles.levelInfo}>
        <span>{currentLevelInfo.name}</span>
        {nextLevelInfo ? <span>NEXT: {nextLevelInfo.name}</span> : <span className={styles.maxText}>ULTRA MODE ACTIVE</span>}
      </div>
      {nextLevelInfo && (
        <div className={styles.meters}>
          {currentMeters.map((meter, idx) => (
            <div key={idx} className={styles.meterWrap}>
              <div className={styles.meterLabel}>{meter.label} {meter.value}</div>
              <div className={styles.meterTrack}>
                <div className={styles.meterFill} style={{ width: `${meter.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
