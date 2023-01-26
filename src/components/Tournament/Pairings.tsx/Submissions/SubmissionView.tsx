import {
  Button,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { PairingSubmission } from '../../../../../types/pairings';
import { Deck, Tournament } from '../../../../../types/tournament';
import { useSessionUserProfile } from '../../../../hooks/user';
import supabase from '../../../../lib/supabase/client';
import ArchetypeSelector from '../../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelector';
import { ArchetypeSelectorModal } from '../../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import DeckInput from '../../../Deck/DeckInput/DeckInput';

export const SubmissionView = ({
  potentialPairingMatches,
  knownDecksCount,
  tournament,
  playerNames,
  tableNumber,
  roundNumber,
}: {
  potentialPairingMatches?: PairingSubmission[];
  knownDecksCount: number;
  tournament: Tournament;
  playerNames: string[];
  tableNumber: number;
  roundNumber: number;
}) => {
  const { data: user } = useSessionUserProfile();
  const modalControls = useDisclosure();
  const toast = useToast();

  const handleUnknownSubmission = useCallback(
    async (deck: Deck) => {
      console.log(deck);
      const res = await supabase.from('Pairing Submissions').insert({
        user_who_submitted: user?.email,
        tournament_id: tournament.id,
        deck_archetype: deck.id,
        player1_name: playerNames[0],
        player2_name: playerNames[1],
        table_number: tableNumber,
        round_number: roundNumber,
      });

      if (res.error) {
        return toast({
          status: 'error',
          title: 'Error submitting pairing',
          description: res.error.message,
        });
      }
    },
    [playerNames, tableNumber, toast, tournament.id, user?.email]
  );

  return (
    <HStack>
      <Button onClick={modalControls.onOpen}>Submit deck</Button>
      {modalControls.isOpen && (
        <ArchetypeSelectorModal
          modalControls={modalControls}
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
