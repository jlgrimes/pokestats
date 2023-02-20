import { memo } from 'react';
import {
  Card,
  CardBody,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { Deck } from '../../../../../types/tournament';
import { ShareStat } from './ShareStat';
import { CommonCard } from '../../../common/CommonCard';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';

export const IndividualShareCard = memo(
  ({
    deck,
    count,
    tournamentRange,
  }: {
    deck: DeckTypeSchema;
    count: number;
    tournamentRange: number[];
  }) => {
    return (
      <CommonCard>
        <Stack direction={'column'} alignItems={'baseline'}>
          <HStack>
            <SpriteDisplay pokemonNames={deck.defined_pokemon} />
            <ShareStat
              deck={{ ...deck, count }}
              tournamentRange={tournamentRange}
            />
          </HStack>
          <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
            <Heading color='gray.700' size={'sm'}>
              {deck.name}
            </Heading>
          </LinkOverlay>
        </Stack>
      </CommonCard>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
