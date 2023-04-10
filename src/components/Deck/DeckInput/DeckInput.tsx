import { UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { memo, useEffect, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import supabase from '../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';
import { handleDeckSubmit } from './helpers';

const DeckInput = memo(
  ({
    playerName,
    deck,
    tournament,
    archetypeModal,
    shouldShowAsText,
    shouldHideDeck,
    shouldHideVerifiedIcon,
    shouldEnableEdits,
    shouldHideSpecificArchetype
  }: {
    playerName: string;
    deck: Deck | undefined;
    tournament: Tournament;
    archetypeModal: UseDisclosureProps;
    shouldShowAsText?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldEnableEdits: boolean;
    shouldHideSpecificArchetype?: boolean;
  }) => {
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
      await handleDeckSubmit(
        newValue,
        deck,
        playerName,
        session.data?.user?.email,
        tournament,
        !!isStreamDeck,
        userIsAdmin,
        toast
      );
      setSelectedDeck(newValue);
    };

    return (
      <ArchetypeSelector
        selectedArchetype={selectedDeck}
        onChange={handleArchetypeSelect}
        modalControls={archetypeModal}
        shouldShowAsText={shouldShowAsText}
        tournament={tournament}
        unownOverride={playerName === 'Isaiah Cheville' ? 'z' : undefined}
        userIsAdmin={userIsAdmin}
        deckIsVerified={deck?.verified}
        shouldHideDeck={shouldHideDeck}
        shouldHideSpecificArchetype={shouldHideSpecificArchetype}
        isStreamDeck={!!isStreamDeck}
        toggleIsStreamDeck={() => setIsStreamDeck(!isStreamDeck)}
        isListUp={!!deck?.list}
        shouldHideVerifiedIcon={shouldHideVerifiedIcon}
        shouldEnableEdits={shouldEnableEdits}
      />
    );
  }
);

DeckInput.displayName = 'DeckInput';

export default DeckInput;
