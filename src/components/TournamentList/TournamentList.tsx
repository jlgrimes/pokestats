import {
  Card,
  CardHeader,
  Stack,
  Heading,
  CardFooter,
  Button,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export const TournamentList = ({
  tournaments,
}: {
  tournaments: { id: string; name: string }[];
}) => {
  return (
    <Stack>
      {tournaments?.map((tournament, idx) => (
        <LinkOverlay key={idx} as={NextLink} href={`/tournaments/${tournament.id}/standings`}>
          <Card>
            <CardHeader>
              <Heading size='md' color='gray.700'>
                {tournament.name}
              </Heading>
            </CardHeader>
          </Card>
        </LinkOverlay>
      ))}
    </Stack>
  );
};
