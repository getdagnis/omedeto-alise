import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './EditCharacterModal.module.sass';
import type { CharacterOption, SoundOption, SoundCategory } from '../config';
import CharacterCard from './CharacterCard';
import { Button, CloseButton, ToggleButton } from '../components-ui';

const SOUND_CATEGORIES: { id: SoundCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'voice', label: 'VOICE' },
  { id: 'beats', label: 'BEATS' },
  { id: 'drums', label: 'DRUMS' },
  { id: 'animals', label: 'ANIMALS' },
  { id: 'melody', label: 'MELODY' },
  { id: 'creepy', label: 'CREEPY' },
  { id: 'calm', label: 'CALM' },
  { id: 'other', label: 'OTHER' },
];

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
  soundIds?: string[];
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

type CharacterColorOption = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

type CharacterImageOption = {
  readonly id: string;
  readonly label: string;
  readonly src: string;
};

type EditCharacterModalProps = {
  isOpen: boolean;
  characters: CharacterOption[];
  editingCharacterId: string | null;
  customizations: CharacterCustomizationMap;
  activeSoundsByCharacter: Record<string, string[]>;
  soundCatalogById: Map<string, SoundOption>;
  colorOptions: readonly CharacterColorOption[];
  imageOptions: readonly CharacterImageOption[];
  ownedSoundIds: string[];
  initialTab?: 'colors' | 'sounds';
  unlockedLevel?: number;
  onClose: () => void;
  onSelectCharacter: (id: string) => void;
  onUpdateCustomization: (id: string, patch: CharacterCustomization) => void;
  onOpenShop?: () => void;
};

const AUTO_SWATCH_STYLE = {
  background: 'conic-gradient(from 120deg, #ffffff, #ff2ad4, #00f5ff, #ffe600, #ffffff)',
};

function EditCharacterModal({
  isOpen,
  characters,
  editingCharacterId,
  customizations,
  activeSoundsByCharacter,
  soundCatalogById,
  colorOptions,
  imageOptions,
  ownedSoundIds,
  initialTab = 'colors',
  unlockedLevel = 0,
  onClose,
  onSelectCharacter,
  onUpdateCustomization,
  onOpenShop,
}: EditCharacterModalProps) {
  const MAX_CHARACTER_SOUNDS = 6;
  const [draftCustomization, setDraftCustomization] = useState<CharacterCustomization>({});
  const [activeTab, setActiveTab] = useState<'colors' | 'sounds'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<SoundCategory | 'all'>('all');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [recentlyActiveSoundIds, setRecentlyActiveIds] = useState<Record<string, number>>({});
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingSoundId, setPreviewingSoundId] = useState<string | null>(null);
  const prevPreviewingIdRef = useRef<string | null>(null);

  const character = characters.find((c) => c.id === editingCharacterId);

  const filteredSounds = useMemo(() => {
    if (!character) return [];
    // Only show sounds that the user OWNS
    const ownedSounds = character.sounds.filter(s => ownedSoundIds.includes(s.id));
    if (activeCategory === 'all') return ownedSounds;
    return ownedSounds.filter((s) => s.category === activeCategory);
  }, [character, activeCategory, ownedSoundIds]);

  useEffect(() => {
    if (prevPreviewingIdRef.current && !previewingSoundId) {
      const id = prevPreviewingIdRef.current;
      setRecentlyActiveIds((prev) => ({ ...prev, [id]: Date.now() }));
      const timeout = window.setTimeout(() => {
        setRecentlyActiveIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 5000);
      return () => window.clearTimeout(timeout);
    }
    prevPreviewingIdRef.current = previewingSoundId;
  }, [previewingSoundId]);

  useEffect(() => {
    if (isOpen && character) {
      setTimeout(() => {
        setDraftCustomization(customizations[character.id] ?? {});
        setActiveTab(initialTab);
      }, 0);
    }
  }, [isOpen, character, customizations, initialTab]);

  // Stop preview on modal close or tab change
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
        setPreviewingSoundId(null);
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen || !editingCharacterId || !character) {
    return null;
  }

  const handleUpdateDraft = (patch: CharacterCustomization) => {
    setDraftCustomization((previous) => ({ ...previous, ...patch }));
  };

  const handleToggleColor = (colorValue: string) => {
    const currentColors = draftCustomization.colorModes ?? [];
    const maxColors = unlockedLevel >= 1 ? 3 : 1;

    if (colorValue === 'auto') {
      handleUpdateDraft({ colorModes: ['auto'] });
      return;
    }

    const filteredColors = currentColors.filter((c) => c !== 'auto');

    if (filteredColors.includes(colorValue)) {
      const nextColors = filteredColors.filter((c) => c !== colorValue);
      handleUpdateDraft({ colorModes: nextColors.length > 0 ? nextColors : ['auto'] });
    } else {
      handleUpdateDraft({
        colorModes: [...filteredColors, colorValue].slice(-maxColors),
      });
    }
  };

  const handleToggleSound = (soundId: string) => {
    const currentSounds = draftCustomization.soundIds ?? [];

    if (currentSounds.includes(soundId)) {
      handleUpdateDraft({ soundIds: currentSounds.filter((id) => id !== soundId) });
    } else {
      if (currentSounds.length >= MAX_CHARACTER_SOUNDS) return;
      handleUpdateDraft({ soundIds: [...currentSounds, soundId] });
    }
  };

  const togglePreviewSound = (soundId: string, path: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }

    if (previewingSoundId === soundId) {
      setPreviewingSoundId(null);
      return;
    }

    const audio = new Audio(path);
    audio.loop = false;
    audio.onended = () => setPreviewingSoundId(null);
    void audio.play().catch(() => undefined);
    previewAudioRef.current = audio;
    setPreviewingSoundId(soundId);
  };

  const handleOk = () => {
    onUpdateCustomization(character.id, draftCustomization);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > 15) return;
    if (value.length > 0 && !/^[a-zA-Z0-9 _]*$/.test(value)) return;
    handleUpdateDraft({ name: value });
  };

  return (
    <>
      <div className={styles.backdrop} onClick={handleCancel} />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Edit character">
        <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
          <header className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>EDIT CHARACTER</h2>
            <CloseButton onPress={handleCancel} aria-label="Close editor" />
          </header>

          <div className={styles.layoutColumns}>
            {/* Left Column: Live Preview */}
            <aside className={styles.columnPreview}>
              <div className={styles.previewContainer}>
                {(() => {
                  const effectiveColorModes =
                    draftCustomization.colorModes && draftCustomization.colorModes.length > 0
                      ? draftCustomization.colorModes
                      : ['auto'];

                  const characterSoundIds = activeSoundsByCharacter[character.id] ?? [];
                  const lastSoundId = characterSoundIds[characterSoundIds.length - 1];
                  const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
                  const autoBackground = lastSoundColorToken
                    ? `var(${lastSoundColorToken})`
                    : character.primaryColor || 'rgba(255, 255, 255, 0.08)';

                  const colors = effectiveColorModes.map((c) => (c === 'auto' ? autoBackground : `var(${c})`));
                  const ringColor = `${colors[0]}99`;

                  return (
                    <div className={styles.cardPreviewWrap}>
                      <CharacterCard
                        character={character}
                        customization={draftCustomization}
                        soundIds={characterSoundIds}
                        soundCatalogById={soundCatalogById}
                        isFavorite={false}
                        isDropActive={false}
                        isGlowBurst={false}
                        comboWord={null}
                        colors={colors}
                        ringColor={ringColor}
                        isImageLoaded={true}
                        hideSounds={true}
                        forceLoop={true}
                        showActions={false}
                        size="large"
                        onEditImage={() => setIsImagePickerOpen(true)}
                      />
                    </div>
                  );
                })()}
              </div>
            </aside>

            {/* Middle Column: Controls */}
            <main className={styles.columnControls}>
              <div className={styles.tabButtons}>
                <button
                  type="button"
                  className={styles.tabButton}
                  data-selected={activeTab === 'colors' ? 'true' : undefined}
                  onClick={() => setActiveTab('colors')}
                >
                  COLORS (
                  {draftCustomization.colorModes?.filter((c) => c !== 'auto').length ?? 0}/
                  {unlockedLevel >= 1 ? 3 : 1})
                </button>
                <button
                  type="button"
                  className={styles.tabButton}
                  data-selected={activeTab === 'sounds' ? 'true' : undefined}
                  onClick={() => setActiveTab('sounds')}
                >
                  SOUNDS ({draftCustomization.soundIds?.length ?? 0}/{MAX_CHARACTER_SOUNDS})
                </button>
              </div>

              {activeTab === 'colors' && (
                <div className={styles.tabContent}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>NAME</span>
                    <input
                      className={styles.textInput}
                      type="text"
                      value={draftCustomization.name ?? ''}
                      placeholder={character.name}
                      onChange={handleUpdateName}
                    />
                  </label>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>COLORS (UP TO {unlockedLevel >= 1 ? 3 : 1})</span>
                    <div className={styles.colorGrid}>
                      {colorOptions.map((option) => {
                        const effectiveColorModes =
                          draftCustomization.colorModes && draftCustomization.colorModes.length > 0
                            ? draftCustomization.colorModes
                            : ['auto'];

                        const selectedIndex = effectiveColorModes.indexOf(option.value);
                        const isSelected = selectedIndex !== -1;

                        const maxColors = unlockedLevel >= 1 ? 3 : 1;
                        const isMaxReached =
                          !isSelected &&
                          effectiveColorModes.length >= maxColors &&
                          !effectiveColorModes.includes('auto');
                        const isDefaultDisabled = !isSelected && !effectiveColorModes.includes('auto');

                        const isDisabled = option.value === 'auto' ? isDefaultDisabled : isMaxReached;

                        const swatchStyle =
                          option.value === 'auto'
                            ? AUTO_SWATCH_STYLE
                            : { background: `var(${option.value})` };

                        return (
                        <button
                          key={option.id}
                          type="button"
                            className={`${styles.colorOption} ${isSelected ? styles.colorOptionActive : ''} ${
                              isDisabled ? styles.colorOptionDisabled : ''
                            }`}
                            onClick={() => handleToggleColor(option.value)}
                          >
                            <span className={styles.colorSwatch} style={swatchStyle} />
                            <span>{option.label.toUpperCase()}</span>
                            {isSelected && option.value !== 'auto' && (
                              <span className={styles.colorBadge}>{selectedIndex + 1}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sounds' && (
                <div className={styles.tabContent}>
                  <div className={styles.field}>
                    <div className={styles.fieldHeader}>
                      <span className={styles.fieldLabel}>YOUR OWNED SOUNDS</span>
                      <div className={styles.soundActions}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          shape="pill"
                          className={styles.randomizeButton}
                          onPress={() => {
                            const owned = character.sounds.filter(s => ownedSoundIds.includes(s.id));
                            const shuffled = [...owned].sort(() => 0.5 - Math.random());
                            handleUpdateDraft({ soundIds: shuffled.slice(0, MAX_CHARACTER_SOUNDS).map((s) => s.id) });
                          }}
                        >
                          RANDOMIZE
                        </Button>
                        <Button type="button" variant="primary" size="sm" shape="pill" className={styles.shopButton} onPress={onOpenShop}>
                          SHOP
                        </Button>
                      </div>
                    </div>

                    <div className={styles.filterBar}>
                      {SOUND_CATEGORIES.map((cat) => (
                        <ToggleButton
                          key={cat.id}
                          className={styles.filterButton}
                          variant="secondary"
                          size="sm"
                          shape="pill"
                          isSelected={activeCategory === cat.id}
                          onChange={() => setActiveCategory(cat.id)}
                        >
                          {cat.label}
                        </ToggleButton>
                      ))}
                    </div>

                    <div className={styles.soundGrid}>
                      {filteredSounds.map((sound) => {
                        const currentSounds = draftCustomization.soundIds ?? [];
                        const isSelected = currentSounds.includes(sound.id);
                        const isMaxReached = !isSelected && currentSounds.length >= MAX_CHARACTER_SOUNDS;
                        const isPreviewing = previewingSoundId === sound.id;
                        const isRecentlyActive = recentlyActiveSoundIds[sound.id];
                        const showDelete = isPreviewing || isRecentlyActive;

                        return (
                          <div
                            key={sound.id}
                            className={`${styles.soundOptionWrap} ${
                              isSelected ? styles.soundOptionActive : ''
                            } ${!isSelected ? styles.soundOptionMuted : ''} ${
                              isSelected ? '' : styles.soundOptionIdle
                            } ${isMaxReached ? styles.soundOptionDisabled : ''} ${
                              isPreviewing ? styles.soundOptionWrapPreviewing : ''
                            }`}
                            style={
                              isSelected
                                ? ({ '--sound-color': `var(${sound.colorToken})` } as React.CSSProperties)
                                : {}
                            }
                          >
                            <button
                              type="button"
                              className={`${styles.soundOptionPreview} ${
                                isPreviewing ? styles.soundOptionPreviewing : ''
                              }`}
                              onClick={() => togglePreviewSound(sound.id, sound.path)}
                              aria-label={isPreviewing ? 'Stop preview' : 'Preview sound'}
                            >
                              <FontAwesomeIcon icon={faVolumeHigh} />
                            </button>
                            <button
                              type="button"
                              className={styles.soundOptionSelect}
                              onClick={() => handleToggleSound(sound.id)}
                            >
                              <span className={styles.soundName}>{sound.name.toUpperCase()}</span>
                            </button>
                            {showDelete && isSelected && (
                              <button
                                type="button"
                                className={styles.soundOptionDelete}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSound(sound.id);
                                }}
                                aria-label="Remove sound"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Right Column: Character Tabs */}
            <nav className={styles.columnTabs}>
              <h3 className={styles.columnTitle}>CHARACTERS</h3>
              <div className={styles.tabsContainer}>
                {characters.map((c) => {
                  const cCustom = customizations[c.id] ?? {};
                  const cSounds = activeSoundsByCharacter[c.id] ?? [];
                  const lastSoundId = cSounds[cSounds.length - 1];
                  const lastSoundColorToken = lastSoundId
                    ? soundCatalogById.get(lastSoundId)?.colorToken
                    : null;
                  const autoBackground = lastSoundColorToken
                    ? `var(${lastSoundColorToken})`
                    : 'rgba(255, 255, 255, 0.08)';

                  const cColors =
                    cCustom.colorModes && cCustom.colorModes.length > 0
                      ? cCustom.colorModes.map((color) =>
                          color === 'auto' ? autoBackground : `var(${color})`,
                        )
                      : [c.primaryColor || autoBackground];

                  return (
                    <CharacterCard
                      key={c.id}
                      character={c}
                      customization={cCustom}
                      soundIds={cSounds}
                      soundCatalogById={soundCatalogById}
                      isFavorite={c.id === editingCharacterId}
                      isDropActive={false}
                      isGlowBurst={false}
                      comboWord={null}
                      colors={cColors}
                      ringColor="transparent"
                      isImageLoaded={true}
                      onSelect={() => onSelectCharacter(c.id)}
                      isSmallPreview={true}
                    />
                  );
                })}
              </div>

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" shape="pill" className={styles.actionButton} onPress={handleCancel}>
                  CANCEL
                </Button>
                <Button type="button" variant="primary" shape="pill" className={styles.actionButton} onPress={handleOk}>
                  OK
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Character Image Picker Modal */}
      {isImagePickerOpen && (
        <div className={styles.subModal} onClick={() => setIsImagePickerOpen(false)}>
          <div className={styles.subModalCard} onClick={(e) => e.stopPropagation()}>
            <header className={styles.subModalHeader}>
              <h3 className={styles.subModalTitle}>SELECT CHARACTER IMAGE</h3>
            </header>

            <div className={styles.imagePickerGrid}>
              {imageOptions.map((option) => {
                const isSelected = (draftCustomization.image ?? character.img) === option.src;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.imagePickerOption} ${
                      isSelected ? styles.imagePickerOptionActive : ''
                    }`}
                    onClick={() => handleUpdateDraft({ image: option.src })}
                    aria-pressed={isSelected}
                  >
                    <img src={option.src} alt={option.label} />
                    <span>{option.label.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            <nav className={styles.subModalActions}>
              <Button type="button" variant="primary" shape="pill" className={styles.actionButton} onPress={() => setIsImagePickerOpen(false)}>
                OK
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default EditCharacterModal;
