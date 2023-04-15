import { Box, Image } from '@chakra-ui/react';
import NextImage from 'next/image';
import { memo } from 'react';

interface CountryFlagProps {
  countryCode: string;
  size?: string;
}

export const CountryFlag = memo((props: CountryFlagProps) => {
  const url = `https://flagsapi.com/${props.countryCode}/flat/64.png`;

  return (
    <Box opacity={props.size === 'lg' ? '0.75' : '0.85'}>
      <NextImage
        priority
        crossOrigin='anonymous'
        alt={`${props.countryCode} flag`}
        src={url}
        height={props.size === 'sm' ? 20 : props.size === 'lg' ? 30 : 25}
        width={props.size === 'sm' ? 40 : props.size === 'lg' ? 60 : 50}
      />
    </Box>
  );
});

CountryFlag.displayName = 'CountryFlag';
