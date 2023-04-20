import { createContext, memo, useContext, useMemo, useState } from 'react';
import { Box, Grid, HStack, Spinner, Switch, Text } from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';
import { getMetaDiff } from './helpers';
import { NoDataDisplay } from './NoDataDisplay';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { useTournaments } from '../../../../hooks/tournaments';
import { Tournament } from '../../../../../types/tournament';

export const ShouldDrillDownMetaShareContext = createContext(false);

export const MetaGameShareList = memo(
  ({
    sortByMoves,
    preview,
    shouldHideSlug,
    tournament,
  }: {
    tournament: Tournament;
    sortByMoves?: boolean;
    preview?: boolean;
    shouldHideSlug?: boolean;
  }) => {
    const [shouldDrillDown, setShouldDrillDown] = useState(false);

    const {
      data: decks,
      isLoading,
      numberReported,
    } = useStoredDecks({
      tournamentId: tournament.id,
      shouldDrillDown,
    });

    return (
      <ShouldDrillDownMetaShareContext.Provider value={shouldDrillDown}>
        <CommonCard
          header={tournament.name ? `${tournament.name} Decks` : `Decks`}
          subheader={`${tournament.players.masters} Masters, ${numberReported} known`}
          {...(shouldHideSlug
            ? {}
            : {
                slug: `/decks?tournament=${tournament.id}`,
              })}
          ghost
          rightElement={
            <HStack padding={2}>
              <Text color='gray.500' fontWeight='semibold' fontSize='md'>
                Drilldown
              </Text>
              <Switch
                isChecked={shouldDrillDown}
                onChange={() => setShouldDrillDown(!shouldDrillDown)}
              />
            </HStack>
          }
        >
          {isLoading ? (
            <Box height={'50rem'}>
              <ComponentLoader />
            </Box>
          ) : decks.length === 0 ? (
            <NoDataDisplay />
          ) : (
            <Grid gridTemplateColumns={'1fr'} gap={2} rowGap={2}>
              {decks
                .slice(0, preview ? 4 : undefined)
                .map(({ deck, count }) => {
                  return (
                    deck?.id && (
                      <IndividualShareCard
                        key={`${deck.name}${deck.id}`}
                        deck={deck}
                        count={count}
                        tournament={tournament}
                      />
                    )
                  );
                })}
            </Grid>
          )}
        </CommonCard>
      </ShouldDrillDownMetaShareContext.Provider>
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
