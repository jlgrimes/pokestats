import { memo, useContext } from 'react';
import {
  Card,
  CardBody,
  Grid,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { Deck, Tournament } from '../../../../../types/tournament';
import { ShareStat } from './ShareStat';
import { CommonCard } from '../../../common/CommonCard';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { FormatContext } from '../DeckAnalyticsContainer';
import { useFormats } from '../../../../hooks/formats/formats';
import { getTournamentFormat } from '../../../../hooks/formats/helpers';

export const IndividualShareCard = memo(
  ({
    deck,
    count,
    tournament,
  }: {
    deck: DeckTypeSchema;
    count: number;
    tournament: Tournament;
  }) => {
    const { colorMode } = useColorMode();
    const { data: formats } = useFormats();
    const format = getTournamentFormat(formats ?? [], tournament);

    return (
      <CommonCard>
        <Stack
          direction={'column'}
          alignItems={'baseline'}
          spacing={4}
          padding={2}
        >
          <Grid gridTemplateColumns='5.2rem auto'>
            <SpriteDisplay pokemonNames={deck.defined_pokemon} />
            <ShareStat deck={{ ...deck, count }} tournamentId={tournament.id} />
          </Grid>
          <LinkOverlay
            as={NextLink}
            href={
              deck.type === 'supertype'
                ? `/decks/${deck.id}`
                : `/decks/${
                    deck.supertype?.id && deck.supertype.id > 0
                      ? deck.supertype.id
                      : 'other'
                  }/${deck.id}`
            }
          >
            <Heading
              color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
              size={'sm'}
            >
              {deck.name}
            </Heading>
          </LinkOverlay>
        </Stack>
      </CommonCard>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
