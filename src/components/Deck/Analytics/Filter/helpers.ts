import { Tournament } from '../../../../../types/tournament';

export const findTournament = (
  tournamentIdInt: number,
  tournaments: Tournament[] | undefined
) => tournaments?.find(({ id }) => parseInt(id) === tournamentIdInt);
