import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './EditCharacterModal.module.sass';
import type { CharacterOption, SoundOption } from '../config';
import CharacterCard from './CharacterCard';

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
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
  onClose: () => void;
  onSelectCharacter: (id: string) => void;
  onUpdateCustomization: (id: string, patch: CharacterCustomization) => void;
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
  onClose,
  onSelectCharacter,
  onUpdateCustomization,
}: EditCharacterModalProps) {
  const [draftCustomization, setDraftCustomization] = useState<CharacterCustomization>({});

  const character = characters.find((c) => c.id === editingCharacterId);

  useEffect(() => {
    if (isOpen && character) {
      setDraftCustomization(customizations[character.id] ?? {});
    }
  }, [isOpen, character, customizations]);

  if (!isOpen || !editingCharacterId || !character) {
    return null;
  }

  const handleUpdateDraft = (patch: CharacterCustomization) => {
    setDraftCustomization((previous) => ({ ...previous, ...patch }));
  };

  const handleToggleColor = (colorValue: string) => {
    const currentColors = draftCustomization.colorModes ?? [];

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
        colorModes: [...filteredColors, colorValue].slice(-3),
      });
    }
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
            <h2 className={styles.modalTitle}>CHARACTER SETTINGS</h2>
            <button type="button" className={styles.closeButton} onClick={handleCancel} aria-label="Close edit panel">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </header>

          <div className={styles.layoutColumns}>
            {/* Left Column: Live Preview */}
            <aside className={styles.columnPreview}>
              <h3 className={styles.columnTitle}>PREVIEW</h3>
              <div className={styles.previewContainer}>
                {(() => {
                  const effectiveColorModes =
                    draftCustomization.colorModes && draftCustomization.colorModes.length > 0
                      ? draftCustomization.colorModes
                      : ['auto'];

                  const characterSoundIds = activeSoundsByCharacter[character.id] ?? [];
                  const lastSoundId = characterSoundIds[characterSoundIds.length - 1];
                  const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
                  const autoBackground = lastSoundColorToken ? `var(${lastSoundColorToken})` : 'rgba(255, 255, 255, 0.08)';

                  const colors = effectiveColorModes.map((c) => (c === 'auto' ? autoBackground : `var(${c})`));

                  return (
                    <CharacterCard
                      character={character}
                      customization={draftCustomization}
                      soundIds={characterSoundIds}
                      soundCatalogById={soundCatalogById}
                      isActive={true}
                      isDropActive={false}
                      isGlowBurst={false}
                      comboWord={null}
                      colors={colors}
                      ringColor="rgba(255, 255, 255, 0.95)"
                      isImageLoaded={true}
                      hideSounds={true}
                      forceLoop={true}
                      showActions={false}
                    />
                  );
                })()}
              </div>
            </aside>

            {/* Middle Column: Controls */}
            <main className={styles.columnControls}>
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
                <span className={styles.fieldLabel}>COLORS (UP TO 3)</span>
                <div className={styles.colorGrid}>
                  {colorOptions.map((option) => {
                    const effectiveColorModes =
                      draftCustomization.colorModes && draftCustomization.colorModes.length > 0
                        ? draftCustomization.colorModes
                        : ['auto'];

                    const selectedIndex = effectiveColorModes.indexOf(option.value);
                    const isSelected = selectedIndex !== -1;
                    const isMaxReached =
                      !isSelected && effectiveColorModes.length >= 3 && !effectiveColorModes.includes('auto');
                    const isDefaultDisabled = !isSelected && !effectiveColorModes.includes('auto');

                    const isDisabled = option.value === 'auto' ? isDefaultDisabled : isMaxReached;

                    const swatchStyle =
                      option.value === 'auto' ? AUTO_SWATCH_STYLE : { background: `var(${option.value})` };

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

              <div className={styles.field}>
                <span className={styles.fieldLabel}>IMAGE</span>
                <div className={styles.imageGrid}>
                  {imageOptions.map((option) => {
                    const isSelected = (draftCustomization.image ?? character.img) === option.src;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.imageOption} ${isSelected ? styles.imageOptionActive : ''}`}
                        onClick={() => handleUpdateDraft({ image: option.src })}
                        aria-pressed={isSelected}
                      >
                        <img src={option.src} alt={option.label} />
                        <span>{option.label.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </main>

            {/* Right Column: Character Tabs */}
            <nav className={styles.columnTabs}>
              <h3 className={styles.columnTitle}>CHARACTERS</h3>
              <div className={styles.tabsContainer}>
                {characters.map((c) => {
                  const cCustom = customizations[c.id] ?? {};
                  const cSounds = activeSoundsByCharacter[c.id] ?? [];
                  const lastSoundId = cSounds[cSounds.length - 1];
                  const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
                  const autoBackground = lastSoundColorToken ? `var(${lastSoundColorToken})` : 'rgba(255, 255, 255, 0.08)';

                  const cColors =
                    cCustom.colorModes && cCustom.colorModes.length > 0
                      ? cCustom.colorModes.map((color) => (color === 'auto' ? autoBackground : `var(${color})`))
                      : [c.primaryColor || autoBackground];

                  return (
                    <CharacterCard
                      key={c.id}
                      character={c}
                      customization={cCustom}
                      soundIds={cSounds}
                      soundCatalogById={soundCatalogById}
                      isActive={c.id === editingCharacterId}
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
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  CANCEL
                </button>
                <button type="button" className={styles.okButton} onClick={handleOk}>
                  OK
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCharacterModal;
