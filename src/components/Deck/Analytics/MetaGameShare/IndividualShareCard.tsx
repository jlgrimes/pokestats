import { memo } from 'react';
import {
  Card,
  CardBody,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { Deck } from '../../../../../types/tournament';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { getNumberOfDecks } from './helpers';
import { ShareStat } from './ShareStat';

export const IndividualShareCard = memo(
  ({
    deck,
    count,
    tournamentRange,
  }: {
    deck: Deck;
    count: number;
    tournamentRange: number[];
  }) => {
    return (
      <Card>
        <CardBody padding={4}>
          <Stack direction={'column'} alignItems={'baseline'}>
            <HStack>
              <SpriteDisplay pokemonNames={deck.defined_pokemon} />
              <ShareStat deck={deck} tournamentRange={tournamentRange} />
            </HStack>
            <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
              <Heading color='gray.700' size={'sm'}>
                {deck.name}
              </Heading>
            </LinkOverlay>
          </Stack>
        </CardBody>
      </Card>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
