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
    const decks = useStoredDecks({ tournamentRange });
    const previousDecks = useStoredDecks({
      tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
    });

    const metaShare = count / getNumberOfDecks(decks);

    const previousMetaDeck =
      tournamentRange[0] === tournamentRange[1]
        ? previousDecks.find(
            ({ deck: previousDeck }) => previousDeck.id === deck.id
          )
        : null;

    const previousMetaShare =
      (previousMetaDeck?.count ?? 0) /
      (previousDecks.length > 0 ? getNumberOfDecks(previousDecks) : 1);
    const metaShareDiff =
      previousMetaShare === 0 ? 1 : metaShare - previousMetaShare;

    return (
      <Card>
        <CardBody padding={4}>
          <Stack direction={'column'} alignItems={'baseline'}>
            <HStack>
              <SpriteDisplay pokemonNames={deck.defined_pokemon} />
              <Stat>
                <StatNumber>{fixPercentage(metaShare * 100)}%</StatNumber>
                {metaShareDiff && (
                  <StatHelpText>
                    <StatArrow
                      type={metaShareDiff >= 0 ? 'increase' : 'decrease'}
                    />
                    {fixPercentage(metaShareDiff * 100)}%
                  </StatHelpText>
                )}
              </Stat>
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
