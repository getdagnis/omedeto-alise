import type { DragEvent } from 'react';
import styles from './CharacterGrid.module.sass';
import CharacterCard from './CharacterCard';
import type { CharacterOption, SoundOption } from '../config';

type CharacterCustomization = {
  name?: string;
  colorModes?: string[];
  image?: string;
};

type CharacterCustomizationMap = Record<string, CharacterCustomization>;

type CharacterGridProps = {
  characters: CharacterOption[];
  favoriteCharacterId: string;
  customizations: CharacterCustomizationMap;
  activeSoundsByCharacter: Record<string, string[]>;
  mutedCharacterIds: Set<string>;
  soundCatalogById: Map<string, SoundOption>;
  loadedCharacterMap: Record<string, boolean>;
  isGlowBurst: boolean;
  comboWord: string | null;
  onSelectCharacter: (characterId: string) => void;
  onToggleFavorite: (characterId: string) => void;
  onDropSound: (event: DragEvent<HTMLDivElement>, characterId: string) => void;
  onImageLoad: (characterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onResetCharacter: (characterId: string) => void;
  onOpenSoundPicker: (characterId: string) => void;
};

const INACTIVE_RING_COLOR = 'rgba(38, 30, 60, 0.85)';

function CharacterGrid({
  characters,
  favoriteCharacterId,
  customizations,
  activeSoundsByCharacter,
  mutedCharacterIds,
  soundCatalogById,
  loadedCharacterMap,
  isGlowBurst,
  comboWord,
  onSelectCharacter,
  onToggleFavorite,
  onDropSound,
  onImageLoad,
  onEditCharacter,
  onResetCharacter,
  onOpenSoundPicker,
}: CharacterGridProps) {
  return (
    <section className={styles.characterStage}>
      <div className={styles.characterGrid}>
        {characters.map((character) => {
          const customization = customizations[character.id] ?? {};
          const characterSoundIds = activeSoundsByCharacter[character.id] ?? [];
          const isFavorite = character.id === favoriteCharacterId;
          const isImageLoaded = Boolean(loadedCharacterMap[character.id]);
          const isMuted = mutedCharacterIds.has(character.id);

          const lastSoundId = characterSoundIds[characterSoundIds.length - 1];
          const lastSoundColorToken = lastSoundId ? soundCatalogById.get(lastSoundId)?.colorToken : null;
          // Only use character default if NO sound is playing. Otherwise use sound color.
          const autoBackground = lastSoundColorToken
            ? `var(${lastSoundColorToken})`
            : character.primaryColor || 'rgba(255, 255, 255, 0.08)';

          const colors = (() => {
            if (customization.colorModes && customization.colorModes.length > 0) {
              return customization.colorModes.map((c) => (c === 'auto' ? autoBackground : `var(${c})`));
            }

            const defaultColor = character.primaryColor || autoBackground;

            return [defaultColor];
          })();

          const ringColor = INACTIVE_RING_COLOR;

          return (
            <CharacterCard
              key={character.id}
              character={character}
              customization={customization}
              soundIds={characterSoundIds}
              soundCatalogById={soundCatalogById}
              isFavorite={isFavorite}
              isDropActive={false}
              isGlowBurst={isGlowBurst}
              comboWord={comboWord}
              colors={colors}
              ringColor={ringColor}
              isImageLoaded={isImageLoaded}
              isMuted={isMuted}
              onSelect={() => onSelectCharacter(character.id)}
              onToggleFavorite={() => onToggleFavorite(character.id)}
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => onDropSound(event, character.id)}
              onImageLoad={() => onImageLoad(character.id)}
              onEdit={() => onEditCharacter(character.id)}
              onReset={() => onResetCharacter(character.id)}
              onOpenSoundPicker={() => onOpenSoundPicker(character.id)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CharacterGrid;
