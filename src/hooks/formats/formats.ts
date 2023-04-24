import { useQuery } from '@tanstack/react-query';
import supabase from '../../lib/supabase/client';

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

export const useMostRecentFormat = () => {
  const formats = useFormats();
  return formats.data ? formats.data[formats.data.length - 1] : null;
};
