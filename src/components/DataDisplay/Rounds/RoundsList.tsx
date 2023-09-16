import { Table, TableBody } from '@tremor/react';
import {
  Standing,
  Tournament,
} from '../../../../types/tournament';
import { Round } from './Round';

export interface RoundsListProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean;
  shouldDisableOpponentModal?: boolean;
  canEditDecks?: boolean;
  userIsAdmin?: boolean;
}

export const RoundsList = (props: RoundsListProps) => {
  const rounds = props.player.rounds?.slice().reverse();

  return (
    <Table>
      <TableBody>
        {rounds?.map(
          (round, idx) =>
            round?.opponent && (
              <Round
                {...props}
                key={idx}
                round={round}
                roundNumber={(rounds?.length ?? 0) - idx}
                opponent={round.opponent}
              />
            )
        )}
      </TableBody>
    </Table>
  );
};
