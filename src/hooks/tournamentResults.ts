import { Standing } from '../../types/tournament';
import { useSessionPlayerProfile } from './user';

export const usePlayerIsMeOrMyOpponent = (player: Standing | undefined) => {
  const { data: profile } = useSessionPlayerProfile();
  const userName = profile?.name;

  if (!player) return true;
  if (!userName) return false;
  if (!player.rounds) return false;

  if (player.name === userName) return true;
  return player.rounds.some(({ name }) => name === userName);
};
