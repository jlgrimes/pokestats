import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  Image,
  UseDisclosureProps,
  Text,
  Flex,
  Link,
  ModalFooter,
  StackItem,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { Deck } from '../../../../../types/tournament';
import { useTwitterLink } from '../../../../hooks/twitter';
import { getLowResUnownUrl } from '../../../common/helpers';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { ArchetypeSelectorModal } from './ArchetypeSelectorModal';

export interface ArchetypeSelectorProps {
  selectedArchetype: Deck | undefined;
  onChange: (value: Deck) => void;
  modalControls: UseDisclosureProps;
  shouldShowAsText?: boolean;
  tournamentId: string;
  unownOverride?: string;
  userIsAdmin: boolean;
  deckIsVerified?: boolean;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const renderDeckName = () => {
    if (props.shouldShowAsText) {
      return (
        <Text>
          {props.selectedArchetype
            ? props.selectedArchetype.name
            : 'Unknown deck'}
        </Text>
      );
    } else {
      if (props.selectedArchetype) {
        const displayedPokemonNames =
          props.selectedArchetype?.defined_pokemon ?? [];

        return (
          <SpriteDisplay
            verified={props.deckIsVerified}
            pokemonNames={displayedPokemonNames}
            deckId={props.selectedArchetype.id}
          />
        );
      } else {
        return (
          <Flex justifyContent={'center'} minWidth='4.5rem'>
            <Image
              height='30px'
              src={getLowResUnownUrl(props.unownOverride)}
              alt='Unown'
            />
          </Flex>
        );
      }
    }
  };

  return (
    <Fragment>
      {renderDeckName()}
      {props.modalControls.isOpen && <ArchetypeSelectorModal {...props} />}
    </Fragment>
  );
}
