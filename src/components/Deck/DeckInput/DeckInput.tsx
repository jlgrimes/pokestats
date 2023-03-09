import { UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Deck } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import supabase from '../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';

export default function DeckInput({
  playerName,
  deck,
  tournamentId,
  archetypeModal,
  shouldShowAsText,
  shouldHideDeck,
  shouldHideVerifiedIcon,
  shouldEnableEdits
}: {
  playerName: string;
  deck: Deck | undefined;
  tournamentId: string;
  archetypeModal: UseDisclosureProps;
  shouldShowAsText?: boolean;
  shouldHideDeck?: boolean;
  shouldHideVerifiedIcon?: boolean;
  shouldEnableEdits: boolean;
}) {
  const deckId = deck?.id;

  const { data: userIsAdmin } = useUserIsAdmin();
  const session = useSession();
  const [selectedDeck, setSelectedDeck] = useState<Deck | undefined>(deck);
  const [isStreamDeck, setIsStreamDeck] = useState(deck?.on_stream);
  const toast = useToast();

  useEffect(() => {
    setSelectedDeck(deck);
  }, [deck]);

  const handleArchetypeSelect = async (newValue: Deck) => {
    if (deckId) {
      const { error } = await supabase
        .from('Player Decks')
        .update({ deck_archetype: newValue.id, on_stream: isStreamDeck })
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
        deck_archetype: newValue.id,
        player_name: playerName,
        tournament_id: tournamentId,
        user_who_submitted: session.data?.user?.email,
        user_submitted_was_admin: userIsAdmin,
        on_stream: isStreamDeck,
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
      deckIsVerified={deck?.verified}
      shouldHideDeck={shouldHideDeck}
      isStreamDeck={!!isStreamDeck}
      toggleIsStreamDeck={() => setIsStreamDeck(!isStreamDeck)}
      isListUp={!!deck?.list}
      shouldHideVerifiedIcon={shouldHideVerifiedIcon}
      shouldEnableEdits={shouldEnableEdits}
    />
  );
}
