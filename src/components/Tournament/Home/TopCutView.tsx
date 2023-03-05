import { Badge, Icon, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../types/tournament';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { CommonCard } from '../../common/CommonCard';
import { PlayerCard } from './PlayerCard/PlayerCard';

interface TopCutViewProps {
  tournament: Tournament;
}

export const TopCutView = (props: TopCutViewProps) => {
  const { data: liveTournamentResults, isLoading } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );

  const topCutPlayers = useMemo(
    () => liveTournamentResults?.data.slice(0, 8),
    [liveTournamentResults?.data]
  );

  return (
    <CommonCard
      header='Top cut'
      ghost
      leftIcon={<Icon color='yellow.500' as={FaTrophy} />}
    >
      <Stack>
        {topCutPlayers &&
          topCutPlayers.map(
            (player: Standing) =>
              !topCutPlayers.some(
                otherPlayer =>
                  player.name === otherPlayer.currentOpponent?.name &&
                  player.placing > otherPlayer?.placing
              ) && (
                <PlayerCard
                  key={`top-cut-${player.name}`}
                  player={player}
                  tournament={props.tournament}
                  shouldHideDecks={false}
                  topCut
                />
              )
          )}
      </Stack>
    </CommonCard>
  );
};
