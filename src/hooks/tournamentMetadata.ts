import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';
import { Tournament } from '../../types/tournament';

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

export const useTournamentMetadata = (tournament: Tournament) => {
  return useQuery({
    queryKey: ['tournament-metadata', tournament.id],
    queryFn: () => fetchOneTournamentMetadata(tournament.id)
  })
};

export const useStreamLink = (tournament: Tournament) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournament);
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

export const useLocation = (tournament: Tournament) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournament);

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

export const useCountryCode = (tournament: Tournament) => {
  const { data: location } = useLocation(tournament);

  const country = location?.address_components?.find(({ types }) =>
    types.includes('country')
  )?.short_name;

  return country;
};

export const useUtcOffset = (tournament: Tournament) => {
  const { data: location } = useLocation(tournament);

  return location?.utc_offset_minutes;
};
