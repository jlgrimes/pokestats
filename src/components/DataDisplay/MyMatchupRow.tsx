import {
  Td,
  Tr,
} from '@chakra-ui/react';

import { memo } from 'react';
import { Standing, Tournament } from '../../../types/tournament';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from './helpers';

export const MyMatchupRow = memo(
  ({
    tournament,
    roundNumber,
    round,
  }: {
    tournament: Tournament;
    roundNumber: number;
    round: { name: string; result: string; opponent: Standing };
  }) => (
    <Tr height='41px'>
      <Td
        padding={0}
        paddingLeft={2}
        backgroundColor={getResultBackgroundColor(round.result)}
        textAlign='center'
      >
        {roundNumber}
      </Td>
      <Td
        maxWidth={'10rem'}
        overflow={'hidden'}
        textOverflow={'ellipsis'}
        padding={0}
        paddingLeft={2}
      >
        <Player
          name={round.opponent.name}
          profile={round.opponent.profile}
        />
      </Td>

      <Td padding={0} paddingLeft={2}>
        {formatRecord(round.opponent.record)}
      </Td>
      <Td padding={0} paddingLeft={2}>
        <DeckInfoDisplay
          tournament={tournament}
          player={round.opponent}
          // We don't want player to edit something they already edited
          enableEdits={!round.opponent.deck.name}
        />
      </Td>
    </Tr>
  )
);

MyMatchupRow.displayName = 'MyMatchupRow';
