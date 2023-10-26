import { UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { memo, useEffect, useState } from 'react';
import { Deck, Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';
import { handleDeckSubmit } from './helpers';

const DeckInput = memo(
  ({
    standing,
    tournament,
    archetypeModal,
    shouldHideDeck,
    shouldHideVerifiedIcon,
    shouldEnableEdits,
    shouldHideSpecificArchetype,
    shouldHideFakeDecks
  }: {
    standing: Standing;
    tournament: Tournament;
    archetypeModal: UseDisclosureProps;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldEnableEdits: boolean;
    shouldHideSpecificArchetype?: boolean;
    shouldHideFakeDecks?: boolean
  }) => {
    const { data: userIsAdmin } = useUserIsAdmin();
    const user = useUser();
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>({
      id: standing.deck_archetype ?? -1,
      name: 'Deck',
      defined_pokemon: standing.defined_pokemon ?? []
    });
    const toast = useToast();

    useEffect(() => {
      setSelectedDeck({
        id: standing.deck_archetype ?? -1,
        name: 'Deck',
        defined_pokemon: standing.defined_pokemon ?? []
      });
    }, [standing.deck_archetype]);

    const handleArchetypeSelect = async (newValue: Deck) => {
      await handleDeckSubmit(
        newValue,
        standing,
        user?.email,
        tournament,
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
        tournament={tournament}
        unownOverride={standing.name === 'Isaiah Cheville' ? 'z' : undefined}
        userIsAdmin={userIsAdmin}
        shouldHideDeck={shouldHideDeck}
        shouldHideSpecificArchetype={shouldHideSpecificArchetype}
        isListUp={!!standing.decklist}
        shouldHideVerifiedIcon={shouldHideVerifiedIcon}
        shouldEnableEdits={shouldEnableEdits}
        shouldHideFakeDecks={shouldHideFakeDecks}
      />
    );
  }
);

DeckInput.displayName = 'DeckInput';

export default DeckInput;
