import { Heading, Stack, LinkOverlay, LinkBox, Badge } from '@chakra-ui/react';

export const AppLogo = () => {
  return (
    <Stack direction='row' alignItems='center'>
      <LinkBox>
        <LinkOverlay href={`/`}>
          <Stack direction={'row'} alignItems='center' spacing={0}>
            <Heading
              color={'gray.700'}
              letterSpacing={'wider'}
              size={'md'}
              fontWeight={'black'}
              lineHeight={'taller'}
            >
              pokéstats
            </Heading>
            <Heading
              letterSpacing={'wider'}
              size={'md'}
              fontWeight={'black'}
              color='red.600'
            >
              .live
            </Heading>
          </Stack>
        </LinkOverlay>
      </LinkBox>
    </Stack>
  );
};
