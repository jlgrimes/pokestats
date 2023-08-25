import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchTournamentMetadata = async () => {
  const res = await supabase
    .from('Tournament Metadata')
    .select('tournament,type,data');

  return res.data;
};

export const fetchOneTournamentMetadata = async (tournamentId: string) => {
  const res = await supabase
    .from('Tournament Metadata')
    .select('tournament,type,data')
    .eq('tournament', tournamentId)

  return res.data;
};

export const useAllTournamentMetadata = () => {
  return useQuery({
    queryKey: ['all-tournament-metadata'],
    queryFn: () => fetchTournamentMetadata(),
  });
};

export const useTournamentMetadata = (tournamentId: string) => {
  return useQuery({
    queryKey: ['tournament-metadata', tournamentId],
    queryFn: () => fetchOneTournamentMetadata(tournamentId)
  })
};

export const useStreamLink = (tournamentId: string) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournamentId);
  return {
    data: tournamentMetadata?.find(({ type }) => type === 'stream')?.data ?? null,
    ...rest,
  };
};

export interface LocationDataSchema {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  utc_offset_minutes: number;
}

export const useLocation = (tournamentId: string) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournamentId);

  const dataStr: string | undefined = tournamentMetadata?.find(
    ({ type }) => type === 'location'
  )?.data;
  const data: LocationDataSchema | undefined = dataStr
    ? JSON.parse(dataStr)
    : undefined;

  return {
    data,
    ...rest,
  };
};

export const useCountryCode = (tournamentId: string) => {
  const { data: location } = useLocation(tournamentId);

  const country = location?.address_components?.find(({ types }) =>
    types.includes('country')
  )?.short_name;

  return country;
};

export const useUtcOffset = (tournamentId: string) => {
  const { data: location } = useLocation(tournamentId);

  return location?.utc_offset_minutes;
};
