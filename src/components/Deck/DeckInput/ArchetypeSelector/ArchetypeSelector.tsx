import { UseDisclosureProps, Text } from '@chakra-ui/react';
import { Fragment, memo } from 'react';
import { Deck, Tournament } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { ArchetypeEditButton } from './ArchetypeEditButton';
import { ArchetypeSelectorModal } from './ArchetypeSelectorModal';

export interface ArchetypeSelectorProps {
  selectedArchetype?: Deck;
  onChange: (value: Deck) => void;
  modalControls: UseDisclosureProps;
  shouldShowAsText?: boolean;
  tournament: Tournament | undefined;
  unownOverride?: string;
  userIsAdmin: boolean;
  deckIsVerified?: boolean;
  shouldHideDeck?: boolean;
  shouldHideVerifiedIcon?: boolean;
  isStreamDeck?: boolean;
  toggleIsStreamDeck?: () => void;
  isListUp: boolean;
  shouldEnableEdits?: boolean;
  shouldHideSpecificArchetype?: boolean;
  isLocal?: boolean;
}

const ArchetypeSelector = memo((props: ArchetypeSelectorProps) => {
  const renderDeckName = () => {
    if (props.shouldShowAsText) {
      return (
        <Text fontSize='lg'>
          {props.selectedArchetype
            ? props.selectedArchetype.name
            : 'Unknown deck'}
        </Text>
      );
    } else {
      return (
        <SpriteDisplay
          verified={!props.shouldHideVerifiedIcon && props.deckIsVerified}
          pokemonNames={props.selectedArchetype?.defined_pokemon}
          deckId={props.selectedArchetype?.id}
          hidden={props.shouldHideDeck}
          shouldBlurSecondSprite={props.shouldHideSpecificArchetype}
        />
      );
    }
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
