import { useQuery } from 'react-query';
import supabase from '../../../lib/supabase/client';

export default function ResultsList() {
  const tournamentName = 'Toronto 2022';
  const { data: results } = useQuery(
    `tournament-results-${tournamentName}`,
    supabase.from('Tournament Results').select('*')
  );

  return <div>{JSON.stringify(results)}</div>;
}
