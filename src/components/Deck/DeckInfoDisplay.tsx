import DeckInput from "./DeckInput/DeckInput";

export const DeckInfoDisplay = () => {
  return (
    <>
      {!opponent?.deck?.list ? (
        <DeckInput
          tournamentId={tournament.id}
          playerName={opponent.name}
          deckName={opponent.deck?.name}
          quickEdit={false}
        />
      ) : (
        <SpriteDisplay pokemonNames={opponent?.deck?.defined_pokemon ?? []} />
      )}
      {opponent.deck.list && (
        <Td padding={0}>
          <ListViewerOpenButton result={opponent} />
        </Td>
      )}
    </>
  );
};
