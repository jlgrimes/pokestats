import { Td, Tr } from '@chakra-ui/react';

import { memo } from 'react';
import { PlayerRound, Standing, Tournament } from '../../../types/tournament';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { Record } from '../Tournament/Results/ResultsList/Record';
import { getResultBackgroundColor } from './helpers';

export const MyMatchupRow = memo(
  ({
    tournament,
    roundNumber,
    round,
    shouldHideDeck,
  }: {
    tournament: Tournament;
    roundNumber: number;
    round: PlayerRound;
    shouldHideDeck: boolean;
  }) =>
    round.opponent ? (
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
          {
            <Player
              name={round.opponent.name}
              profile={round.opponent.profile}
            />
          }
        </Td>

        <Td padding={0} paddingLeft={2}>
          <Record standing={round.opponent} />
        </Td>
        <Td padding={0} paddingLeft={2}>
          <DeckInfoDisplay
            tournament={tournament}
            player={round.opponent}
            // We don't want player to edit something they already edited
            enableEdits={!round.opponent.deck?.name}
            shouldHideDeck={shouldHideDeck}
            shouldHideVerifiedIcon
            isPlayerMeOrMyOpponent={true}
          />
        </Td>
      </Tr>
    ) : null
);

MyMatchupRow.displayName = 'MyMatchupRow';
