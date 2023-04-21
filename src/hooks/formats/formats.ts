import { useQuery } from '@tanstack/react-query';
import { differenceInDays, isBefore, parseISO } from 'date-fns';
import { Tournament } from '../../../types/tournament';
import supabase from '../../lib/supabase/client';
import { getTournamentFormat } from './helpers';

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

  if (!formats?.data)
    return {
      ...formats,
      data: undefined,
    };

  if (!tournament?.date) {
    return {
      ...formats,
      data: formats.data[formats.data.length - 1],
    };
  }

  const mostRecentFormat = getTournamentFormat(formats.data, tournament);

  return {
    ...formats,
    data: mostRecentFormat,
  };
};

export const useMostRecentFormat = () => {
  const formats = useFormats();
  return formats.data ? formats.data[formats.data.length - 1] : null;
};
