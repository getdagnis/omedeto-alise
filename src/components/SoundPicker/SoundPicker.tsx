import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faPen, faThumbtack, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from 'react-aria-components';
import { Button, CloseButton, ProgressCircle, Modal, Heading } from '../../components-ui';
import { SoundBar } from '../SoundBar/SoundBar';
import styles from './SoundPicker.module.sass';
import type { CharacterOption, SoundOption } from '../../config';

const MAX_CHARACTER_SOUNDS = 9;

export type PickerRandomBusy = { kind: 'slot'; index: number } | { kind: 'shuffle' };

export type SoundPickerProps = {
  isOpen: boolean;
  characterId: string | null;
  characters: CharacterOption[];
  characterCustomizations: Record<string, { name?: string }>;
  pickerSlots: Array<string | null>;
  pickerSelectedSoundIds: string[];
  pickerPinnedSoundIds: string[];
  pickerRandomBusy: PickerRandomBusy | null;
  pickerActionSoundId: string | null;
  previewingSoundId: string | null;
  soundCatalogById: Map<string, SoundOption>;
  soundsPerCharacter: number;
  onClose: () => void;
  onEditSounds: (characterId: string) => void;
  onNavigateShop: () => void;
  onShuffleAll: (characterId: string) => void;
  onSlotRandom: (characterId: string, index: number) => void;
  onPreviewSound: (soundId: string, path: string) => void;
  onSoundBarPress: (soundId: string, path: string) => void;
  onRemoveSound: (soundId: string) => void;
  onTogglePin: (soundId: string) => void;
  onApply: (characterId: string) => void;
  onOpenCollection: (characterId: string) => void;
};

export function SoundPicker({
  isOpen,
  characterId,
  characters,
  characterCustomizations,
  pickerSlots,
  pickerSelectedSoundIds,
  pickerPinnedSoundIds,
  pickerRandomBusy,
  pickerActionSoundId,
  previewingSoundId,
  soundCatalogById,
  onClose,
  onEditSounds,
  onNavigateShop,
  onShuffleAll,
  onSlotRandom,
  onPreviewSound,
  onSoundBarPress,
  onRemoveSound,
  onTogglePin,
  onApply,
  onOpenCollection,
}: SoundPickerProps) {
  if (!characterId) return null;

  const character = characters.find((entry) => entry.id === characterId);
  if (!character) return null;

  const characterName = characterCustomizations[characterId]?.name?.trim() || character.name;
  const pickerSpinnerSize = 18;
  const isPickerRandomBusy = pickerRandomBusy !== null;
  const slotSpinnerIndex = pickerRandomBusy?.kind === 'slot' ? pickerRandomBusy.index : null;

  const availableSoundsCount = pickerSlots.filter((id): id is string => Boolean(id)).length;
  const visibleSlots = Array.from({ length: MAX_CHARACTER_SOUNDS }, (_, index) => {
    const soundId = pickerSlots[index];
    return soundId ? (soundCatalogById.get(soundId) ?? null) : null;
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable>
      <Dialog className={styles.pickerCard}>
        <header className={styles.pickerHeader}>
          <div className={styles.pickerHeaderLeft}>
            <Heading level={3} className={styles.pickerTitle}>
              SOUND PICKER
            </Heading>
            <Button
              type="button"
              variant="quiet"
              size="sm"
              shape="square"
              className={styles.editSoundsButton}
              onPress={() => onEditSounds(characterId)}
              aria-label="Edit sounds"
            >
              <FontAwesomeIcon icon={faPen} />
            </Button>
          </div>
          <CloseButton onPress={onClose} aria-label="Close sound selector" />
        </header>
        <div className={styles.pickerContent}>
          <div className={styles.pickerSections}>
            <section className={styles.pickerLibrary}>
              <div className={styles.pickerLibraryHeader}>
                <div>
                  <p className={styles.pickerSectionEyebrow}>This Character's Mix</p>
                  <h4 className={styles.pickerSectionTitle}>Choose up to {MAX_CHARACTER_SOUNDS} sounds</h4>
                </div>
                <span className={styles.pickerLibraryCount}>
                  {availableSoundsCount}/{MAX_CHARACTER_SOUNDS}
                </span>
              </div>

              <div className={styles.pickerOptionActions}>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  shape="default"
                  className={styles.emptyPickerButton}
                  onPress={() => onOpenCollection(characterId)}
                >
                  YOUR COLLECTION
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  shape="default"
                  className={styles.emptyPickerButton}
                  onPress={onNavigateShop}
                >
                  SHOP FOR SOUNDS
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  shape="default"
                  className={`${styles.emptyPickerButton} ${styles.pickerButtonCallout}`}
                  onPress={() => onShuffleAll(characterId)}
                  isDisabled={isPickerRandomBusy}
                >
                  {pickerRandomBusy?.kind === 'shuffle' ? (
                    <span className={styles.pickerShuffleButtonInner}>
                      <ProgressCircle aria-label="Shuffling" isIndeterminate value={0} size={pickerSpinnerSize} />
                      <span>SHUFFLE SOUNDS</span>
                    </span>
                  ) : (
                    'SHUFFLE SOUNDS'
                  )}
                </Button>
              </div>

              <div className={styles.pickerList}>
                {visibleSlots.map((sound, index) => {
                  if (!sound) {
                    return (
                      <div
                        key={`empty-slot-${index}`}
                        className={`${styles.pickerItemWrap} ${styles.pickerItemWrapEmpty}`}
                      >
                        <div
                          className={`${styles.pickerItemPreview} ${styles.pickerItemPreviewEmpty}`}
                          aria-hidden="true"
                        />
                        <button
                          type="button"
                          className={`${styles.pickerItemSelect} ${styles.pickerItemSelectEmpty}`}
                          onClick={() => onSlotRandom(characterId, index)}
                          disabled={isPickerRandomBusy}
                          aria-label="Add random sound"
                          aria-busy={slotSpinnerIndex === index}
                        >
                          {slotSpinnerIndex === index ? (
                            <ProgressCircle aria-hidden isIndeterminate value={0} size={pickerSpinnerSize} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowsRotate} />
                          )}
                        </button>
                      </div>
                    );
                  }

                  const isSelected = pickerSelectedSoundIds.includes(sound.id);
                  const isPinned = pickerPinnedSoundIds.includes(sound.id);
                  const isPreviewing = previewingSoundId === sound.id;
                  const isActionActive = pickerActionSoundId === sound.id;
                  const showFullActions = isSelected || isActionActive;
                  const showPinOnly = !showFullActions && (isPinned || isActionActive);

                  return (
                    <SoundBar
                      key={sound.id}
                      name={sound.name}
                      colorToken={sound.colorToken}
                      isSelected={isSelected}
                      isPreviewing={isPreviewing}
                      onPreview={() => onPreviewSound(sound.id, sound.path)}
                      onSelect={() => onSoundBarPress(sound.id, sound.path)}
                      className={styles.pickerItemBar}
                      actions={
                        <>
                          {showFullActions && (
                            <>
                              <button
                                type="button"
                                className={styles.pickerItemDelete}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveSound(sound.id);
                                }}
                                aria-label="Remove sound"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                              <button
                                type="button"
                                className={styles.pickerItemRefresh}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotRandom(characterId, index);
                                }}
                                disabled={isPickerRandomBusy}
                                aria-label="Replace with random sound"
                                aria-busy={slotSpinnerIndex === index}
                              >
                                {slotSpinnerIndex === index ? (
                                  <ProgressCircle aria-hidden isIndeterminate value={0} size={pickerSpinnerSize} />
                                ) : (
                                  <FontAwesomeIcon icon={faArrowsRotate} />
                                )}
                              </button>
                              <button
                                type="button"
                                className={`${styles.pickerItemPin} ${isPinned ? styles.pickerItemPinActive : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePin(sound.id);
                                }}
                                aria-label={isPinned ? 'Unpin sound' : 'Pin sound'}
                                aria-pressed={isPinned}
                              >
                                <FontAwesomeIcon icon={faThumbtack} />
                              </button>
                            </>
                          )}
                          {!showFullActions && showPinOnly && (
                            <button
                              type="button"
                              className={`${styles.pickerItemPin} ${isPinned ? styles.pickerItemPinActive : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePin(sound.id);
                              }}
                              aria-label={isPinned ? 'Unpin sound' : 'Pin sound'}
                              aria-pressed={isPinned}
                            >
                              <FontAwesomeIcon icon={faThumbtack} />
                            </button>
                          )}
                        </>
                      }
                    />
                  );
                })}
              </div>
            </section>
            <div className={styles.pickerFooterActions}>
              <Button
                type="button"
                variant="primary"
                size="md"
                shape="default"
                className={styles.pickerApplyButton}
                onPress={() => onApply(characterId)}
                isDisabled={pickerSelectedSoundIds.length === 0}
              >
                {`APPLY TO ${characterName.toUpperCase()}`}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </Modal>
  );
}
