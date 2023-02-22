import { LocationDataSchema } from '../tournamentMetadata';

export const useCountryCode = () => 'AU';
export const useUtcOffset = () => 500;

export const useLocation = (tournamentId: string) => {
  const data: LocationDataSchema = {
    address_components: [
      {
        long_name: 'Australia',
        short_name: 'AU',
        types: ['AU'],
      },
    ],
    formatted_address: 'Australia',
    utc_offset_minutes: 500,
  };

  return {
    data,
  };
};
