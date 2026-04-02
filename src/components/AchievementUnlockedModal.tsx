import styles from './AchievementUnlockedModal.module.sass';

type AchievementUnlockedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  unlockNextTitle: string;
  unlockNextLines: string[];
  buttonLabel: string;
};

export default function AchievementUnlockedModal({
  isOpen,
  onClose,
  title,
  message,
  unlockNextTitle,
  unlockNextLines,
  buttonLabel,
}: AchievementUnlockedModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.nextBlock}>
          <div className={styles.nextTitle}>{unlockNextTitle}</div>
          <div className={styles.nextLines}>
            {unlockNextLines.map((line, idx) => (
              <div key={idx} className={styles.nextLine}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <button type="button" className={styles.ctaButton} onClick={onClose}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

