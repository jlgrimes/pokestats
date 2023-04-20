import { Box, Link, Stack } from '@chakra-ui/react';
export default function ContactUs() {
  return (
    <Stack maxWidth={'container.md'}>
      <Box>
        Hiya! If you have any questions, comments, concerns, shoot us an email
        at{' '}
        <Link href={'mailto:help@pokestats.live'} color='blue.500'>
          help@pokestats.live
        </Link>
        .
      </Box>
      <Box>Have a nice day!</Box>
    </Stack>
  );
}
