import { PairingSubmission } from '../../../../../types/pairings';

const getDeductedPlayerDeckRow = (
  name: string,
  deckId: number,
  tournamentId: string,
  username: string
) => ({
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
  roundNumber: number
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

  const playerDeckRowsToInsert = [];
  const pairingSubmissionRowsToRemove: PairingSubmission[] = [];

  for (const i of [0, 1]) {
    if (pairingSubmissionMap[playerNames[i]]) {
      // throw error
      if (pairingSubmissionMap[playerNames[i]].length < 2) return;

      pairingSubmissionRowsToRemove.concat(
        pairingSubmissionMap[playerNames[i]]
      );

      const potentialDecks = pairingSubmissionMap[playerNames[i]].map(
        submission => submission.deck_archetype
      );
      const deductedPlayerDeckIdx = potentialDecks.findIndex(id =>
        deckIds.includes(id)
      );
      const deductedPlayerDeck = potentialDecks.at(deductedPlayerDeckIdx);
      if (!deductedPlayerDeck) return;

      const earlierOpponentDeck = potentialDecks.at(
        (deductedPlayerDeckIdx + 1) % 2
      );
      const submittedOpponentDeck =
        (deckIds.findIndex(id => id === deductedPlayerDeck) + 1) / 2;
      console.log('current p deck', deductedPlayerDeck);
      console.log('current opp deck', submittedOpponentDeck);
      console.log('found opp deck', earlierOpponentDeck);
    }
  }
};
