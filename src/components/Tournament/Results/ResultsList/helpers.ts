export const formatRecord = (record: {
  wins: number;
  losses: number;
  ties: number;
}) => {
  return `${record.wins}-${record.losses}-${record.ties}`;
};

export const formatRecordNeed = (
  matchPointRequirement: number,
  record: {
    wins: number;
    losses: number;
    ties: number;
  },
) => {
  const matchPointsRemaining =
    matchPointRequirement - 3 * record.wins - record.ties;
  let needForRecord = '';

  const winsNeeded = Math.floor(matchPointsRemaining / 3);
  const tiesNeeded = matchPointsRemaining - winsNeeded * 3;

  if (winsNeeded > 0)
    needForRecord += `${winsNeeded} win${winsNeeded > 1 ? 's' : ''}`;
  if (tiesNeeded > 0) {
    if (winsNeeded > 0) needForRecord += ', ';
    needForRecord += `${tiesNeeded} tie${tiesNeeded > 1 ? 's' : ''}`;
  }

  return needForRecord;
};

export const madeDayTwo = (record: {
  wins: number;
  losses: number;
  ties: number;
}) => {
  if (record.wins * 3 + record.ties >= 19) {
    return true;
  }

  if (record.wins + record.losses + record.ties >= 9) {
    return false;
  }

  return undefined;
}