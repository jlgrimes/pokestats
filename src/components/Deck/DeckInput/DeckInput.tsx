import { UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useUserIsAdmin } from '../../../hooks/administrators';
import supabase from '../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';

export default function DeckInput({
  playerName,
  deckId,
  tournamentId,
  archetypeModal,
  shouldShowAsText,
}: {
  playerName: string;
  deckId: number | undefined;
  tournamentId: string;
  archetypeModal: UseDisclosureProps;
  shouldShowAsText?: boolean;
}) {
  const { data: userIsAdmin } = useUserIsAdmin();
  const session = useSession();
  const [selectedDeck, setSelectedDeck] = useState(deckId);
  const toast = useToast();

  useEffect(() => {
    setSelectedDeck(deckId);
  }, [deckId]);

  const handleArchetypeSelect = async (newValue: number) => {
    if (deckId) {
      const { error } = await supabase
        .from('Player Decks')
        .update({ deck_archetype: newValue })
        .match({ player_name: playerName, tournament_id: tournamentId });

      if (error) {
        toast({
          status: 'error',
          title: error.message,
          description: error.details,
        });
      } else {
        toast({
          status: 'success',
          title: 'Player deck reported successfully!',
          description: 'Thanks for contributing!',
        });
        setSelectedDeck(newValue);
      }
    } else {
      const { error } = await supabase.from('Player Decks').insert({
        deck_archetype: newValue,
        player_name: playerName,
        tournament_id: tournamentId,
        user_who_submitted: session.data?.user.email,
        user_submitted_was_admin: userIsAdmin,
      });

      if (error) {
        toast({
          status: 'error',
          title: error.message,
          description: error.details,
        });
      } else {
        toast({
          status: 'success',
          title: 'Player deck reported successfully!',
          description: 'Thanks for contributing!',
        });
        setSelectedDeck(newValue);
      }
    }
  };

  return (
    <ArchetypeSelector
      selectedArchetype={selectedDeck}
      onChange={handleArchetypeSelect}
      modalControls={archetypeModal}
      shouldShowAsText={shouldShowAsText}
      tournamentId={tournamentId}
      unownOverride={playerName === 'Isaiah Cheville' ? 'z' : undefined}
      userIsAdmin={userIsAdmin}
    />
  );
}
