import { Box, Image } from '@chakra-ui/react';
import NextImage from 'next/image';
import { memo } from 'react';

interface CountryFlagProps {
  countryCode: string;
  smol?: boolean;
}

export const CountryFlag = memo((props: CountryFlagProps) => {
  const url = `https://countryflagsapi.com/png/${props.countryCode}`;

  return (
    <Box opacity='0.85'>
      <NextImage
        crossOrigin='anonymous'
        alt={`${props.countryCode} flag`}
        src={url}
        height={props.smol ? 20 : 25}
        width={props.smol ? 40 : 50}
      />
    </Box>
  );
});

CountryFlag.displayName = 'CountryFlag';
