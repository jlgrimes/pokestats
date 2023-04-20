import { memo, useContext } from 'react';
import {
  Box,
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
import { ConversionStat } from './ConversionStat';

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

    const link =
      deck.type === 'supertype'
        ? `/decks/${deck.id}`
        : `/decks/${
            deck.supertype?.id && deck.supertype.id > 0
              ? deck.supertype.id
              : 'other'
          }/${deck.id}`;

    if (count <= 20)
      return (
        <CommonCard>
          <Grid
            gridTemplateColumns={'2fr 1fr'}
            paddingX={2}
            gap={2}
            alignItems='center'
          >
            <SpriteDisplay pokemonNames={deck.defined_pokemon} />
            <ShareStat deck={{ ...deck, count }} tournamentId={tournament.id} />
            <LinkOverlay
              gridColumn={'1/-1'}
              as={NextLink}
              href={
                {
                  pathname: link,
                  query: { format: format?.id },
                } as any
              }
            >
              <Heading
                color={colorMode === 'dark' ? 'gray.100' : 'gray.600'}
                size={'sm'}
              >
                {deck.name}
              </Heading>
            </LinkOverlay>
          </Grid>
        </CommonCard>
      );

    return (
      <Box gridColumn={'1/-1'}>
        <CommonCard>
          <Grid
            gridTemplateColumns={'1.5fr 1fr 1fr'}
            paddingX={2}
            gap={2}
            alignItems='center'
          >
            <Stack>
              <SpriteDisplay pokemonNames={deck.defined_pokemon} />
              <LinkOverlay
                as={NextLink}
                href={
                  {
                    pathname: link,
                    query: { format: format?.id },
                  } as any
                }
              >
                <Heading
                  color={colorMode === 'dark' ? 'gray.100' : 'gray.600'}
                  size={'sm'}
                >
                  {deck.name}
                </Heading>
              </LinkOverlay>
            </Stack>
            <ShareStat deck={{ ...deck, count }} tournamentId={tournament.id} />
            <ConversionStat
              deck={{ ...deck, count }}
              tournamentId={tournament.id}
            />
          </Grid>
        </CommonCard>
      </Box>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
