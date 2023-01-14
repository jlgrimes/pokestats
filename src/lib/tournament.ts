export const shortenTournamentName = (tournamentName: string) => {
  return tournamentName.split('Pokémon')[0].trim();
};
