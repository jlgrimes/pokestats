import { UseDisclosureProps, Text } from '@chakra-ui/react';
import { Fragment, memo } from 'react';
import { Deck, Tournament } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { ArchetypeEditButton } from './ArchetypeEditButton';
import { ArchetypeSelectorModal } from './ArchetypeSelectorModal';

export interface ArchetypeSelectorProps {
  selectedArchetype: Deck | null;
  onChange: (value: Deck) => void;
  modalControls: UseDisclosureProps;
  tournament: Tournament;
  unownOverride?: string;
  userIsAdmin: boolean;
  shouldHideDeck?: boolean;
  shouldHideVerifiedIcon?: boolean;
  isListUp: boolean;
  shouldEnableEdits?: boolean;
  shouldHideSpecificArchetype?: boolean;
}

const ArchetypeSelector = memo((props: ArchetypeSelectorProps) => {
  const renderDeckName = () => {
    return (
      <SpriteDisplay
        // I hate this checkmark Nope
        verified={false}
        pokemonNames={props.selectedArchetype?.defined_pokemon}
        deckId={props.selectedArchetype?.id}
        hidden={props.shouldHideDeck}
        shouldBlurSecondSprite={props.shouldHideSpecificArchetype}
      />
    );
  };

  return (
    <Fragment>
      {props.shouldEnableEdits &&
      !props.selectedArchetype?.id &&
      props.modalControls.onOpen ? (
        <ArchetypeEditButton onEditOpen={props.modalControls.onOpen} />
      ) : (
        renderDeckName()
      )}
      {props.shouldEnableEdits && <ArchetypeSelectorModal {...props} />}
    </Fragment>
  );
});

ArchetypeSelector.displayName = 'ArchetypeSelector';

export default ArchetypeSelector;
