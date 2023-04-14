import { PairingSubmission } from '../../../../../types/pairings';
import { PlayerDeck } from '../../../../../types/player-deck';
import * as Sentry from '@sentry/browser';

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

interface RowsForSubmittedPairingSchema {
  playerDeckRowsToInsert: PlayerDeck[];
  pairingSubmissionRowsToRemove: PairingSubmission[];
}

export const nullSubmission = {
  playerDeckRowsToInsert: [],
  pairingSubmissionRowsToRemove: [],
};

export const getRowsForSubmittedPairing = (
  pairingSubmissions: PairingSubmission[] | null | undefined,
  playerNames: string[],
  deckIds: number[],
  tournamentId: string,
  username: string
): RowsForSubmittedPairingSchema => {
  if (!pairingSubmissions) return nullSubmission;

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
  let pairingSubmissionRowsToRemove: PairingSubmission[] = [];

  try {
    for (const i of [0, 1]) {
      if (pairingSubmissionMap[playerNames[i]]) {
        // throw error
        if (pairingSubmissionMap[playerNames[i]].length < 2)
          return nullSubmission;

        pairingSubmissionRowsToRemove = pairingSubmissionMap[playerNames[i]];

        const potentialDecks = pairingSubmissionMap[playerNames[i]];
        const deductedPlayerDeckIdx = potentialDecks.findIndex(submission =>
          deckIds.includes(submission.deck_archetype)
        );
        const deductedPlayerDeck =
          potentialDecks[deductedPlayerDeckIdx].deck_archetype;

        const earlierOpponent = potentialDecks[(deductedPlayerDeckIdx + 1) % 2];
        const earlierOpponentDeck = earlierOpponent?.deck_archetype;
        const earlierOpponentName =
          earlierOpponent?.player1_name === playerNames[i]
            ? earlierOpponent.player2_name
            : earlierOpponent?.player1_name;

        const submittedOpponentDeck =
          deckIds[(deckIds.findIndex(id => id === deductedPlayerDeck) + 1) % 2];
        const submittedDecksAreSame =
          earlierOpponentDeck === submittedOpponentDeck;

        if (
          !deductedPlayerDeck ||
          !earlierOpponentDeck ||
          !earlierOpponentName ||
          !submittedOpponentDeck ||
          submittedDecksAreSame
        )
          return nullSubmission;

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
      }
    }
  } catch (err) {
    Sentry.captureException(err);
  }

  return {
    playerDeckRowsToInsert,
    pairingSubmissionRowsToRemove,
  };
};
