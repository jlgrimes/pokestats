import { Badge, Icon, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
import { PlayerCard } from '../PlayerCard/PlayerCard';

interface TopCutViewProps {
  tournament: Tournament;
  players?: Standing[];
  isLoading?: boolean;
}

export const TopCutView = (props: TopCutViewProps) => {
  return (
    <CommonCard
      header='Top cut'
      ghost
      leftIcon={<Icon color='yellow.500' as={FaTrophy} />}
    >
      <Stack>
        {props.players &&
          props.players.map(
            (player: Standing) =>
              !props.players!.some(
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
