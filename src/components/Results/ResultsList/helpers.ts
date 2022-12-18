export const formatRecord = (record: {
  wins: number;
  losses: number;
  ties: number;
}) => {
  return `${record.wins}-${record.losses}-${record.ties}`;
};
