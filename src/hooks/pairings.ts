import { useQuery } from '@tanstack/react-query';
import {
  FetchPairingsOptions,
  FetchPairingsSchema,
  Pairing,
  PairingsSchema,
} from '../../types/pairings';
import supabase from '../lib/supabase/client';

export const fetchPairingSubmissions = async (tournamentId: string) => {
  const res = await supabase
    .from('Pairing Submissions')
    .select(
      `id,deck_archetype,player1_name,player2_name,user_who_submitted,table_number,round_number`
    )
    .eq('tournament_id', tournamentId);
  return res.data;
};

export const usePairingSubmissions = (tournamentId: string) => {
  return useQuery({
    queryKey: ['pairings'],
    queryFn: () => fetchPairingSubmissions(tournamentId),
  });
};

export const fetchPairings = async (
  tournamentId: string,
  options?: FetchPairingsOptions
): Promise<PairingsSchema[]> => {
  const res = await fetch(`/api/pairings/?tournamentId=${tournamentId}`);
  const data: PairingsSchema[] = await res.json();

  return data;
};

export const usePairings = (
  tournamentId: string,
  options?: FetchPairingsOptions
) => {
  const query = useQuery({
    queryKey: ['pairings', tournamentId],
    queryFn: () => fetchPairings(tournamentId, options),
  });

  let data = query.data;
  let ret: FetchPairingsSchema;

  if (!data)
    return {
      ...query,
      data: {
        round: null,
        tables: null,
        maxRound: null,
      },
    };

  if (options?.roundNumber) {
    ret = {
      round: options.roundNumber,
      tables: data[options.roundNumber - 1]?.tables,
      maxRound: data.length,
    };
  } else {
    ret = {
      round: data.length,
      tables: data[data.length - 1]?.tables,
      maxRound: data.length,
    };
  }

  return {
    ...query,
    data: ret,
  };
};
