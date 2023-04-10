import { useQuery } from '@tanstack/react-query';
import { differenceInDays, isBefore, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';
import supabase from '../lib/supabase/client';

export const fetchFormats = async () => {
  const res = await supabase
    .from('Formats')
    .select('id,format,rotation,start_date');
  return res.data;
};

export interface FormatSchema {
  id: number;
  format: string;
  rotation: string;
  start_date: string;
}

export const useFormats = () => {
  return useQuery({
    queryKey: ['formats'],
    queryFn: fetchFormats,
  });
};

export const useCurrentFormat = (tournament?: Tournament) => {
  const formats = useFormats();

  if (!formats?.data) return {
    ...formats,
    data: undefined
  };

  if (!tournament?.date) {
    return {
      ...formats,
      data: formats.data[0]
    }
  }

  let mostRecentFormat;
  for (const format of formats.data) {
    if (!mostRecentFormat) {
      mostRecentFormat = format;
    } else {
      const tournamentIsBefore = isBefore(
        parseISO(format.start_date),
        parseISO(tournament.date.start)
      );
      const tournamentIsCloserToDate =
        differenceInDays(
          parseISO(tournament.date.start),
          parseISO(format.start_date)
        ) <
        differenceInDays(
          parseISO(tournament.date.start),
          parseISO(mostRecentFormat.start_date)
        );

      if (tournamentIsBefore && tournamentIsCloserToDate) {
        mostRecentFormat = format;
      }
    }
  }

  return {
    ...formats,
    data: mostRecentFormat,
  };
};
