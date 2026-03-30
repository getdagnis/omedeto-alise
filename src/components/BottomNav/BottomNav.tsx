import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, faLock, faCheck, faStar, faCoins, 
  faArrowLeft, faCartShopping, faTrash, faBolt, faVolumeHigh 
} from '@fortawesome/free-solid-svg-icons';
import styles from './BottomNav.module.sass';
import type { ProgressionState, ProgressionLevel } from '../../progression';
import { PROGRESSION_LEVELS } from '../../progression';
import type { SoundOption } from '../../config';

export type BottomNavMode = 'HOME' | 'EDIT' | 'SHOP' | 'ADMIN';

type BottomNavProps = {
  mode: BottomNavMode;
  state: ProgressionState;
  currentLevelInfo: ProgressionLevel;
  nextLevelInfo: ProgressionLevel | null;
  cartIds: string[];
  soundCatalogById: Map<string, SoundOption>;
  onBack: () => void;
  onAction: () => void; // e.g. Save in Edit, Checkout in Shop
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  // Quick Shop props
  isQuickShopActive: boolean;
  quickShopSounds: SoundOption[];
  onQuickShopAdd: (id: string) => void;
  onQuickShopSkip: () => void;
  onPreviewSound: (id: string, path: string) => void;
  previewingSoundId: string | null;
  forceExpandCart?: boolean;
  onCloseExpanded?: () => void;
};

export default function BottomNav({
  mode,
  state,
  currentLevelInfo,
  nextLevelInfo,
  cartIds,
  soundCatalogById,
  onBack,
  onAction,
  onRemoveFromCart,
  onCheckout,
  isQuickShopActive,
  quickShopSounds,
  onQuickShopAdd,
  onQuickShopSkip,
  onPreviewSound,
  previewingSoundId,
  forceExpandCart = false,
  onCloseExpanded,
}: BottomNavProps) {
  const [expandedView, setExpandedView] = useState<'NONE' | 'CHALLENGES' | 'CART' | 'QUICK_SHOP'>(
    isQuickShopActive ? 'QUICK_SHOP' : 'NONE'
  );

  // Sync with external force expansion
  useMemo(() => {
    if (forceExpandCart) setExpandedView('CART');
  }, [forceExpandCart]);

  const handleClose = () => {
    setExpandedView('NONE');
    onCloseExpanded?.();
  };

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
  const cartTotal = useMemo(() => {
    return cartIds.reduce((sum, id) => sum + (soundCatalogById.get(id)?.price ?? 0), 0);
  }, [cartIds, soundCatalogById]);

  // Handle auto-expansion for quick shop
  useMemo(() => {
    if (isQuickShopActive) setExpandedView('QUICK_SHOP');
    else if (expandedView === 'QUICK_SHOP') setExpandedView('NONE');
  }, [isQuickShopActive]);

  const renderExpandedContent = () => {
    if (expandedView === 'CHALLENGES') {
      return (
        <div className={styles.levelList}>
          {PROGRESSION_LEVELS.map((level: ProgressionLevel) => {
            const isCleared = state.unlockedLevel > level.level || (level.level === 0 && state.unlockedLevel > 0);
            const isActive = (nextLevelInfo?.level === level.level) || (nextLevelInfo === null && level.level === PROGRESSION_LEVELS.length - 1);
            const isLocked = !isCleared && !isActive;

            return (
              <div key={level.level} className={`${styles.levelCard} ${isCleared ? styles.levelCleared : ''} ${isActive ? styles.levelActive : ''} ${isLocked ? styles.levelLocked : ''}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.levelBadge}>{isCleared ? <FontAwesomeIcon icon={faCheck} /> : level.level}</div>
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
                          <div className={styles.detailedLabels}><span>{m.label}</span><span>{m.value}</span></div>
                          <div className={styles.detailedTrack}><div className={styles.detailedFill} style={{ width: `${m.percent}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (expandedView === 'CART') {
      return (
        <div className={styles.cartContent}>
          <div className={styles.cartList}>
            {cartIds.length === 0 ? (
              <p className={styles.emptyCart}>YOUR BASKET IS EMPTY</p>
            ) : (
              cartIds.map(id => {
                const sound = soundCatalogById.get(id);
                return (
                  <div key={id} className={styles.cartItem}>
                    <span className={styles.cartItemName}>{sound?.name.toUpperCase()}</span>
                    <span className={styles.cartItemPrice}>{sound?.price}Y</span>
                    <button className={styles.cartItemDelete} onClick={() => onRemoveFromCart(id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>TOTAL:</span>
              <strong>{cartTotal}Y</strong>
            </div>
            <button 
              className={styles.purchaseBtn} 
              disabled={cartIds.length === 0 || state.walletBalance < cartTotal}
              onClick={onCheckout}
            >
              PURCHASE NOW
            </button>
          </div>
        </div>
      );
    }

    if (expandedView === 'QUICK_SHOP') {
      const allInCart = quickShopSounds.length > 0 && quickShopSounds.every(s => cartIds.includes(s.id));
      
      // Auto-advance if all 3 are in cart
      if (allInCart) {
        setTimeout(() => {
          onQuickShopSkip();
        }, 800);
      }

      return (
        <div className={styles.quickShopContent}>
          <header className={styles.quickShopHeader}>
            <div className={styles.quickShopHeaderLeft}>
              <h3>DISCOVER SOUNDS</h3>
              <button 
                className={`${styles.headerCheckoutBtn} ${cartIds.length > 0 ? styles.headerCheckoutBtnActive : ''}`}
                onClick={() => setExpandedView('CART')}
                disabled={cartIds.length === 0}
              >
                CHECKOUT ({cartIds.length})
              </button>
            </div>
            <div className={styles.quickShopWallet}>
              <FontAwesomeIcon icon={faCoins} /> {state.walletBalance}Y
            </div>
          </header>
          <div className={styles.quickShopGrid}>
            {quickShopSounds.map((sound) => {
              const isPreviewing = previewingSoundId === sound.id;
              const inCart = cartIds.includes(sound.id);
              return (
                <div key={sound.id} className={styles.quickItem}>
                  <button 
                    className={`${styles.quickPreview} ${isPreviewing ? styles.previewing : ''}`}
                    onClick={() => onPreviewSound(sound.id, sound.path)}
                  >
                    <FontAwesomeIcon icon={faVolumeHigh} />
                  </button>
                  <span className={styles.quickName}>{sound.name.toUpperCase()}</span>
                  <button 
                    className={`${styles.quickAdd} ${inCart ? styles.quickAddInCart : ''}`}
                    onClick={() => onQuickShopAdd(sound.id)}
                  >
                    {inCart ? <FontAwesomeIcon icon={faCartShopping} /> : `${sound.price}Y`}
                  </button>
                </div>
              );
            })}
          </div>
          <button className={styles.skipBtn} onClick={onQuickShopSkip}>
            SKIP TO NEXT THREE <FontAwesomeIcon icon={faBolt} />
          </button>
        </div>
      );
    }

    return null;
  };

  const isExpanded = expandedView !== 'NONE';

  const isDesktop = typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches;
  if (isDesktop && mode === 'EDIT' && !isExpanded) return null;

  return (
    <>
      {isExpanded && <div className={styles.overlay} onClick={handleClose} />}
      
      <div className={`${styles.navContainer} ${isExpanded ? styles.isExpanded : ''}`}>
        {isExpanded && (
          <header className={styles.expandedHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={expandedView === 'CHALLENGES' ? faStar : faCartShopping} className={styles.starIcon} />
              <h2>{expandedView.replace('_', ' ')}</h2>
            </div>
            <button className={styles.closeButton} onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </header>
        )}

        {isExpanded ? (
          <div className={styles.expandedBody}>
            {renderExpandedContent()}
          </div>
        ) : (
          <div className={styles.collapsedBar}>
            {mode === 'HOME' ? (
              <div className={styles.progressionLeft} onClick={() => setExpandedView('CHALLENGES')}>
                <div className={styles.levelInfo}>
                  <span>{currentLevelInfo.name}</span>
                  {nextLevelInfo ? <span>NEXT: {nextLevelInfo.name}</span> : <span className={styles.maxText}>ULTRA MODE</span>}
                </div>
                <div className={styles.meters}>
                  {currentMeters.map((meter, idx) => (
                    <div key={idx} className={styles.meterWrap}>
                      <div className={styles.meterTrack}><div className={styles.meterFill} style={{ width: `${meter.percent}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button className={styles.backBtn} onClick={onBack}>
                <FontAwesomeIcon icon={faArrowLeft} /> BACK
              </button>
            )}

            <div className={styles.barRight}>
              {mode === 'SHOP' && cartIds.length > 0 && (
                <button className={styles.checkoutBtn} onClick={() => setExpandedView('CART')}>
                  CHECKOUT ({cartIds.length})
                </button>
              )}
              {mode === 'EDIT' && (
                <button className={styles.saveBtnNav} onClick={onAction}>SAVE</button>
              )}
              <div className={styles.footerWallet}>
                <FontAwesomeIcon icon={faCoins} className={styles.footerCoinIcon} />
                <span>{state.walletBalance}Y</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
