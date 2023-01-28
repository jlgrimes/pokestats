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
import { updatePairingSubmissions } from './helpers';

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
  const potentialPairingMatches = pairingSubmissions?.filter(
    submission =>
      !(
        submission.round_number === roundNumber &&
        submission.table_number === tableNumber
      ) &&
      (submission.player1_name === playerNames[0] ||
        submission.player2_name === playerNames[0] ||
        submission.player1_name === playerNames[1] ||
        submission.player2_name === playerNames[1])
  );

  useEffect(() => {
    addToUpdateLog('if anyone sees this page, no you didnt');
    updatePairingSubmissions(
      pairingSubmissions,
      playerNames,
      [5, 1],
      tableNumber,
      roundNumber,
      tournament.id,
      user?.email ?? ''
    );
  }, []);

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
      modalControls.onClose();
      refetchData();

      if (res.error) {
        return toast({
          status: 'error',
          title: 'Error submitting pairing',
          description: res.error.message,
        });
      }
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
