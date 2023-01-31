import {
  Button,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { PairingSubmission } from '../../../../../types/pairings';
import { Deck, Tournament } from '../../../../../types/tournament';
import { useSessionUserProfile } from '../../../../hooks/user';
import supabase from '../../../../lib/supabase/client';
import ArchetypeSelector from '../../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelector';
import { ArchetypeSelectorModal } from '../../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import DeckInput from '../../../Deck/DeckInput/DeckInput';
import { getRowsForSubmittedPairing } from './helpers';

export const SubmissionView = ({
  pairingSubmissions,
  knownDecksCount,
  tournament,
  playerNames,
  tableNumber,
  roundNumber,
  refetchData,
  addToUpdateLog,
}: {
  pairingSubmissions?: PairingSubmission[] | null;
  knownDecksCount: number;
  tournament: Tournament;
  playerNames: string[];
  tableNumber: number;
  roundNumber: number;
  refetchData: () => {};
  addToUpdateLog: (name: string) => void;
}) => {
  const { data: user } = useSessionUserProfile();
  const modalControls = useDisclosure();
  const toast = useToast();
  const [decksToAdd, setDecksToAdd] = useState<number[]>([]);

  const currentRoundPairingMatches = pairingSubmissions?.filter(
    submission =>
      submission.round_number === roundNumber &&
      submission.table_number === tableNumber
  );

  const handleUnknownSubmission = useCallback(
    async (deck: Deck) => {
      if (decksToAdd.length === 0) {
        setDecksToAdd([...decksToAdd, deck.id]);

        return toast({
          status: 'info',
          title: 'Add another one',
        });
      }

      const commonRowData = {
        user_who_submitted: user?.email,
        tournament_id: tournament.id,
        player1_name: playerNames[0],
        player2_name: playerNames[1],
        table_number: tableNumber,
        round_number: roundNumber,
      };

      const { playerDeckRowsToInsert, pairingSubmissionRowsToRemove } =
        getRowsForSubmittedPairing(
          pairingSubmissions,
          playerNames,
          [decksToAdd[0], deck.id],
          tournament.id,
          user?.email ?? ''
        );

      if (
        playerDeckRowsToInsert.length === 0 &&
        pairingSubmissionRowsToRemove.length === 0
      ) {
        const res = await supabase.from('Pairing Submissions').insert([
          {
            ...commonRowData,
            deck_archetype: deck.id,
          },
          {
            ...commonRowData,
            deck_archetype: decksToAdd[0],
          },
        ]);

        if (res.error) {
          return toast({
            status: 'error',
            title: 'Error submitting pairing',
            description: res.error.message,
          });
        }
      } else {
        if (playerDeckRowsToInsert.length > 0) {
          const res = await supabase
            .from('Player Decks')
            .insert(playerDeckRowsToInsert);

          if (res.error) {
            return toast({
              status: 'error',
              title: 'Error inserting player decks',
              description: res.error.message,
            });
          }
        }

        if (pairingSubmissionRowsToRemove.length > 0) {
          const res = await supabase
            .from('Pairing Submissions')
            .delete()
            .filter(
              'id',
              'in',
              JSON.stringify(pairingSubmissionRowsToRemove.map(({ id }) => id))
                .replace('[', '(')
                .replace(']', ')')
            );

          if (res.error) {
            return toast({
              status: 'error',
              title: 'Error deleting submissions',
              description: res.error.message,
            });
          }
        }
      }

      modalControls.onClose();
      refetchData();
    },
    [
      playerNames,
      tableNumber,
      toast,
      tournament.id,
      user?.email,
      roundNumber,
      refetchData,
      decksToAdd,
      modalControls,
    ]
  );

  return (
    <HStack>
      <Button
        disabled={currentRoundPairingMatches?.length === 2}
        variant='outline'
        onClick={modalControls.onOpen}
      >
        Submit deck
      </Button>
      <Text>
        {currentRoundPairingMatches?.length ?? 0}{' '}
        {currentRoundPairingMatches?.length === 1 ? 'deck' : 'decks'} reported
      </Text>
      {modalControls.isOpen && (
        <ArchetypeSelectorModal
          modalControls={{
            ...modalControls,
            onClose: () => {},
          }}
          tournamentId={tournament.id}
          onChange={handleUnknownSubmission}
          userIsAdmin
          // Hard code
          isListUp={false}
        />
      )}
    </HStack>
  );
};
