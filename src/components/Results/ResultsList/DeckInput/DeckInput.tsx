import supabase from '../../../../lib/supabase/client';
import ArchetypeSelector from '../../ResultForm/ArchetypeSelector';

export default function DeckInput({
  playerName,
  deckName,
}: {
  playerName: string;
  deckName: string | undefined;
}) {
  const handleArchetypeSelect = async (newValue: string) => {
    const res = await supabase
      .from('Player Decks')
      .update({ deck_archetype: newValue })
      .eq('player_name', playerName);
  };

  return (
    <ArchetypeSelector value={deckName} onChange={handleArchetypeSelect} />
  );
}
