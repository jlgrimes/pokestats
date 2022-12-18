import ArchetypeSelector from "../../ResultForm/ArchetypeSelector";

export default function DeckInput({ deckName }: { deckName: string | undefined }) {
  const handleArchetypeSelect = async () => {

  };

  return (
    <ArchetypeSelector value={deckName} onChange={handleArchetypeSelect} />
  )
}