import { Heading, Skeleton, Stack } from '@chakra-ui/react';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecordNeed, formatRecord } from './ResultsList/helpers';
import { ordinalSuffixOf } from '../../../lib/strings';
import { Standing, Tournament } from '../../../../types/tournament';
import { Record } from './ResultsList/Record';
import { CombinedPlayerProfile } from '../../../../types/player';
import { RecordIcon } from './ResultsList/RecordIcon';
import { getPercentile } from './helpers';
import { useCallback } from 'react';
import { useColor } from '../../../hooks/useColor';
import { PlayerCard } from '../Home/PlayerCard/PlayerCard';
import { Table, TableBody } from '@tremor/react';

export const PlayerMatchupStatus = ({
  tournament,
  user,
  shouldHideOpponentView,
  isLoggedInUser,
  myStanding,
}: {
  tournament: Tournament;
  user: CombinedPlayerProfile | null;
  shouldHideOpponentView?: boolean;
  isLoggedInUser?: boolean;
  myStanding: Standing | null | undefined;
}) => {
  const renderLoadingSkeleton = useCallback(
    () => <Skeleton height={63.9} />,
    []
  );

  if (!user) return renderLoadingSkeleton();
  
  return myStanding && user && (
    <Table className='mb-4'>
      <TableBody>
        <PlayerCard
          player={myStanding}
          tournament={tournament}
          canEditDecks
          shouldHideOpponent
          shouldDisableOpponentModal
        />
      </TableBody>
    </Table>
  )
};
