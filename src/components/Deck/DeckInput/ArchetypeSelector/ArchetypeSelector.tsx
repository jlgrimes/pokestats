import { UseDisclosureProps, Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { ArchetypeEditButton } from './ArchetypeEditButton';
import { ArchetypeSelectorModal } from './ArchetypeSelectorModal';

export interface ArchetypeSelectorProps {
  selectedArchetype?: Deck;
  onChange: (value: Deck) => void;
  modalControls: UseDisclosureProps;
  shouldShowAsText?: boolean;
  tournamentId: string;
  unownOverride?: string;
  userIsAdmin: boolean;
  deckIsVerified?: boolean;
  shouldHideDeck?: boolean;
  shouldHideVerifiedIcon?: boolean;
  isStreamDeck?: boolean;
  toggleIsStreamDeck?: () => void;
  isListUp: boolean;
  shouldEnableEdits?: boolean;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
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
      {props.modalControls.isOpen && <ArchetypeSelectorModal {...props} />}
    </Fragment>
  );
}
