import { Box, Image } from '@chakra-ui/react';

interface CountryFlagProps {
  countryCode: string;
  smol?: boolean;
}

export const CountryFlag = (props: CountryFlagProps) => {
  const url = `https://countryflagsapi.com/png/${props.countryCode}`;

  return (
    <Box>
      <Image
        opacity='0.85'
        crossOrigin='anonymous'
        alt={`${props.countryCode} flag`}
        src={url}
        height={`${props.smol ? 20 : 25}px`}
      />
    </Box>
  );
};
