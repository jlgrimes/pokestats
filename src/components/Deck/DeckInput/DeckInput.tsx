import { UseDisclosureProps } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useUserIsAdmin } from '../../../hooks/administrators';
import supabase from '../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';

export default function DeckInput({
  playerName,
  deckName,
  tournamentId,
  quickEdit,
  archetypeModal,
  shouldShowAsText,
}: {
  playerName: string;
  deckName: string | undefined;
  tournamentId: string;
  quickEdit: boolean;
  archetypeModal: UseDisclosureProps;
  shouldShowAsText?: boolean
}) {
  const userIsAdmin = useUserIsAdmin();
  const session = useSession();

  const handleArchetypeSelect = async (newValue: string) => {
    if (deckName) {
      await supabase
        .from('Player Decks')
        .update({ deck_archetype: newValue })
        .eq('player_name', playerName);
    } else {
      await supabase.from('Player Decks').insert({
        deck_archetype: newValue,
        player_name: playerName,
        tournament_id: tournamentId,
        user_who_submitted: session.data?.user.username,
        user_submitted_was_admin: userIsAdmin
      });
    }
  };

  return (
    <ArchetypeSelector
      value={deckName}
      onChange={handleArchetypeSelect}
      quickEdit={quickEdit}
      modalControls={archetypeModal}
      shouldShowAsText={shouldShowAsText}
      tournamentId={tournamentId}
    />
  );
}
