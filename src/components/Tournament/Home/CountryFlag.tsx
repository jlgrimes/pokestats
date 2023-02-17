import { Box, Image } from '@chakra-ui/react';

interface CountryFlagProps {
  countryCode: string;
}

export const CountryFlag = (props: CountryFlagProps) => {
  const url = `https://countryflagsapi.com/png/${props.countryCode}`;

  return (
    <Box>
      <Image
        crossOrigin='anonymous'
        alt={`${props.countryCode} flag`}
        src={url}
        height='25px'
      />
    </Box>
  );
};
