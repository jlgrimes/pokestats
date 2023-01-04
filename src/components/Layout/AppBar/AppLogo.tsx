import { Heading, Stack, LinkOverlay, LinkBox, Badge } from '@chakra-ui/react';

export const AppLogo = () => {
  return (
    <Stack direction='row' alignItems='baseline'>
      <LinkBox>
        <LinkOverlay href={`/`}>
          <Stack direction={'row'} alignItems='center'>
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
            <Badge colorScheme={'yellow'}>beta</Badge>
          </Stack>
        </LinkOverlay>
      </LinkBox>
    </Stack>
  );
};
