import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './EditCharacterModal.module.sass';
import type { CharacterOption, SoundOption } from '../config';
import CharacterCard from './CharacterCard';

type CharacterCustomization = {
  name?: string;
  colorMode?: 'auto' | string;
  image?: string;
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

type CharacterColorOption = {
  id: string;
  label: string;
  value: string;
};

type CharacterImageOption = {
  id: string;
  label: string;
  src: string;
};

type EditCharacterModalProps = {
  isOpen: boolean;
  characters: CharacterOption[];
  editingCharacterId: string | null;
  customizations: CharacterCustomizationMap;
  activeSoundsByCharacter: Record<string, string[]>;
  soundCatalogById: Map<string, SoundOption>;
  colorOptions: CharacterColorOption[];
  imageOptions: CharacterImageOption[];
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
  const currentCustomization = character ? customizations[character.id] ?? {} : {};

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

  const handleSave = () => {
    onUpdateCustomization(character.id, draftCustomization);
  };

  const handleUndo = () => {
    setDraftCustomization(currentCustomization);
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Edit character">
        <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
          <header className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Character Settings</h2>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close edit panel">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </header>

          <div className={styles.layoutColumns}>
            {/* Left Column: Live Preview */}
            <aside className={styles.columnPreview}>
              <h3 className={styles.columnTitle}>Preview</h3>
              <div className={styles.previewContainer}>
                {(() => {
                  const colorMode = draftCustomization.colorMode ?? 'auto';
                  const characterSoundIds = activeSoundsByCharacter[character.id] ?? [];
                  const lastSoundId = characterSoundIds[characterSoundIds.length - 1];
                  const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
                  const autoBackground = lastSoundColorToken ? `var(${lastSoundColorToken})` : 'rgba(255, 255, 255, 0.08)';
                  const backgroundColor = colorMode !== 'auto' ? `var(${colorMode})` : autoBackground;

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
                      backgroundColor={backgroundColor}
                      ringColor="rgba(255, 255, 255, 0.95)"
                      isImageLoaded={true}
                      hideSounds={true}
                      actions={
                        <>
                          <button type="button" className={styles.saveButton} onClick={handleSave}>
                            Save
                          </button>
                          <button type="button" className={styles.undoButton} onClick={handleUndo}>
                            Undo
                          </button>
                        </>
                      }
                    />
                  );
                })()}
              </div>
            </aside>

            {/* Middle Column: Controls */}
            <main className={styles.columnControls}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  className={styles.textInput}
                  type="text"
                  value={draftCustomization.name ?? ''}
                  placeholder={character.name}
                  onChange={(event) => handleUpdateDraft({ name: event.target.value })}
                />
              </label>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Color</span>
                <div className={styles.colorGrid}>
                  {colorOptions.map((option) => {
                    const isSelected = (draftCustomization.colorMode ?? 'auto') === option.value;
                    const swatchStyle =
                      option.value === 'auto' ? AUTO_SWATCH_STYLE : { background: `var(${option.value})` };

                    return (
                      <label
                        key={option.id}
                        className={`${styles.colorOption} ${isSelected ? styles.colorOptionActive : ''}`}
                      >
                        <input
                          type="radio"
                          name="character-color"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleUpdateDraft({ colorMode: option.value })}
                        />
                        <span className={styles.colorSwatch} style={swatchStyle} />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Image</span>
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
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </main>

            {/* Right Column: Character Tabs */}
            <nav className={styles.columnTabs}>
              <h3 className={styles.columnTitle}>Characters</h3>
              <div className={styles.tabsContainer}>
                {characters.map((c) => {
                  const cCustom = customizations[c.id] ?? {};
                  const cSounds = activeSoundsByCharacter[c.id] ?? [];
                  const lastSoundId = cSounds[cSounds.length - 1];
                  const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
                  const autoBackground = lastSoundColorToken ? `var(${lastSoundColorToken})` : 'rgba(255, 255, 255, 0.08)';
                  const cColorMode = cCustom.colorMode ?? 'auto';
                  const cBackground = cColorMode !== 'auto' ? `var(${cColorMode})` : autoBackground;

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
                      backgroundColor={cBackground}
                      ringColor="transparent"
                      isImageLoaded={true}
                      onSelect={() => onSelectCharacter(c.id)}
                      isSmallPreview={true}
                    />
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCharacterModal;
