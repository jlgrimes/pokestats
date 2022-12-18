import supabase from '../../../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';

export default function DeckInput({
  playerName,
  deckName,
  tournamentId,
}: {
  playerName: string;
  deckName: string | undefined;
  tournamentId: string;
}) {
  const handleArchetypeSelect = async (newValue: string) => {
    if (deckName) {
      await supabase
        .from('Player Decks')
        .update({ deck_archetype: newValue })
        .eq('player_name', playerName);
    } else {
      await supabase
        .from('Player Decks')
        .insert({
          deck_archetype: newValue,
          player_name: playerName,
          tournament_id: tournamentId,
        });
    }
  };

  return (
    <ArchetypeSelector value={deckName} onChange={handleArchetypeSelect} />
  );
}
