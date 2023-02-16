import { PairingSubmission } from '../../../../../types/pairings';
import { getRowsForSubmittedPairing, nullSubmission } from './helpers';

describe('getRowsForSubmittedPairing', () => {
  const mockSubmission = {
    id: 0,
    deck_archetype: 1,
    player1_name: 'jared',
    player2_name: 'noah',
    user_who_submitted: 'jared',
    table_number: 1,
    round_number: 1,
  };

  const pairingSubmissions: PairingSubmission[] = [
    {
      ...mockSubmission,
      player1_name: 'jared',
      player2_name: 'noah',
      deck_archetype: 1,
    },
    {
      ...mockSubmission,
      player1_name: 'jared',
      player2_name: 'noah',
      deck_archetype: 2,
    },
  ];

  const playerNames = ['jared', 'tord'];
  const tournamentId = '0';
  const username = 'jared';

  // Assert
  const expectedPlayerDeck = {
    on_stream: false,
    user_submitted_was_admin: true,
    tournament_id: tournamentId,
    user_who_submitted: username,
  };

  it('should return null submission if pairing submissions is null', () => {
    expect(getRowsForSubmittedPairing(null, [], [], '0', 'jared')).toEqual(
      nullSubmission
    );
  });

  it('should not deduct anything if there is no history for either player', () => {
    expect(
      getRowsForSubmittedPairing(
        [],
        playerNames,
        [1, 3],
        tournamentId,
        username
      )
    ).toEqual(nullSubmission);
  });

  it('should correctly deduct decks', () => {
    const deckIds = [1, 3];

    expect(
      getRowsForSubmittedPairing(
        pairingSubmissions,
        playerNames,
        deckIds,
        tournamentId,
        username
      )
    ).toEqual({
      pairingSubmissionRowsToRemove: pairingSubmissions,
      playerDeckRowsToInsert: [
        {
          ...expectedPlayerDeck,
          deck_archetype: 1,
          player_name: 'jared',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 3,
          player_name: 'tord',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 2,
          player_name: 'noah',
        },
      ],
    });
  });

  it('should correctly deduct decks with flipped deckIds', () => {
    const deckIds = [3, 1];

    expect(
      getRowsForSubmittedPairing(
        pairingSubmissions,
        playerNames,
        deckIds,
        tournamentId,
        username
      )
    ).toEqual({
      pairingSubmissionRowsToRemove: pairingSubmissions,
      playerDeckRowsToInsert: [
        {
          ...expectedPlayerDeck,
          deck_archetype: 1,
          player_name: 'jared',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 3,
          player_name: 'tord',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 2,
          player_name: 'noah',
        },
      ],
    });
  });

  it('should correctly deduct decks for the second player', () => {
    const deckIds = [3, 1];

    expect(
      getRowsForSubmittedPairing(
        pairingSubmissions,
        ['tord', 'jared'],
        deckIds,
        tournamentId,
        username
      )
    ).toEqual({
      pairingSubmissionRowsToRemove: pairingSubmissions,
      playerDeckRowsToInsert: [
        {
          ...expectedPlayerDeck,
          deck_archetype: 1,
          player_name: 'jared',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 3,
          player_name: 'tord',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 2,
          player_name: 'noah',
        },
      ],
    });
  });

  it('should correctly deduct a mirror match', () => {
    const deckIds = [1, 1];

    expect(
      getRowsForSubmittedPairing(
        pairingSubmissions,
        playerNames,
        deckIds,
        tournamentId,
        username
      )
    ).toEqual({
      pairingSubmissionRowsToRemove: pairingSubmissions,
      playerDeckRowsToInsert: [
        {
          ...expectedPlayerDeck,
          deck_archetype: 1,
          player_name: 'jared',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 1,
          player_name: 'tord',
        },
        {
          ...expectedPlayerDeck,
          deck_archetype: 2,
          player_name: 'noah',
        },
      ],
    });
  });

  it('should not deduct when previous match is same', () => {
    const deckIds = [1, 2];

    expect(
      getRowsForSubmittedPairing(
        pairingSubmissions,
        playerNames,
        deckIds,
        tournamentId,
        username
      )
    ).toEqual(nullSubmission);
  });
});

export {};
