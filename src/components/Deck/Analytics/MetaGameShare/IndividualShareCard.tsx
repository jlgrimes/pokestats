import { memo } from 'react';
import {
  Card,
  CardBody,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  useColorMode,
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
    const { colorMode } = useColorMode();

    return (
      <CommonCard>
        <Stack
          direction={'column'}
          alignItems={'baseline'}
          spacing={4}
          paddingX={4}
          paddingY={2}
        >
          <HStack>
            <SpriteDisplay pokemonNames={deck.defined_pokemon} />
            <ShareStat
              deck={{ ...deck, count }}
              tournamentRange={tournamentRange}
            />
          </HStack>
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
