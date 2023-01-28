import { PairingSubmission } from '../../../../../types/pairings';
import { PlayerDeck } from '../../../../../types/player-deck';

const getDeductedPlayerDeckRow = (
  name: string,
  deckId: number,
  tournamentId: string,
  username: string
): PlayerDeck => ({
  player_name: name,
  deck_archetype: deckId,
  tournament_id: tournamentId,
  user_who_submitted: username,
  user_submitted_was_admin: true,
  on_stream: false,
});

export const updatePairingSubmissions = (
  pairingSubmissions: PairingSubmission[] | null | undefined,
  playerNames: string[],
  deckIds: number[],
  tableNumber: number,
  roundNumber: number,
  tournamentId: string,
  username: string
) => {
  if (!pairingSubmissions) return;

  const pairingSubmissionMap: Record<string, PairingSubmission[]> =
    pairingSubmissions.reduce(
      (acc: Record<string, PairingSubmission[]>, submission) => {
        return {
          ...acc,
          [submission.player1_name]: [
            ...(acc[submission.player1_name] ?? []),
            submission,
          ],
          [submission.player2_name]: [
            ...(acc[submission.player2_name] ?? []),
            submission,
          ],
        };
      },
      {}
    );

  let playerDeckRowsToInsert: PlayerDeck[] = [];
  const pairingSubmissionRowsToRemove: PairingSubmission[] = [];

  for (const i of [0, 1]) {
    if (pairingSubmissionMap[playerNames[i]]) {
      // throw error
      if (pairingSubmissionMap[playerNames[i]].length < 2) return;

      pairingSubmissionRowsToRemove.concat(
        pairingSubmissionMap[playerNames[i]]
      );

      const potentialDecks = pairingSubmissionMap[playerNames[i]];
      const deductedPlayerDeckIdx = potentialDecks.findIndex(submission =>
        deckIds.includes(submission.deck_archetype)
      );
      const deductedPlayerDeck = potentialDecks.at(
        deductedPlayerDeckIdx
      )?.deck_archetype;

      const earlierOpponent = potentialDecks.at(
        (deductedPlayerDeckIdx + 1) % 2
      );
      const earlierOpponentDeck = earlierOpponent?.deck_archetype;
      const earlierOpponentName =
        earlierOpponent?.player1_name === playerNames[i]
          ? earlierOpponent.player2_name
          : earlierOpponent?.player1_name;

      const submittedOpponentDeck = deckIds.at(
        (deckIds.findIndex(id => id === deductedPlayerDeck) + 1) % 2
      );

      if (
        !deductedPlayerDeck ||
        !earlierOpponentDeck ||
        !earlierOpponentName ||
        !submittedOpponentDeck
      )
        return;

      playerDeckRowsToInsert = [
        getDeductedPlayerDeckRow(
          playerNames[i],
          deductedPlayerDeck,
          tournamentId,
          username
        ),
        getDeductedPlayerDeckRow(
          playerNames[(i + 1) % 2],
          submittedOpponentDeck,
          tournamentId,
          username
        ),
        getDeductedPlayerDeckRow(
          earlierOpponentName,
          earlierOpponentDeck,
          tournamentId,
          username
        ),
      ];
      console.log(playerDeckRowsToInsert);
    }
  }
};
