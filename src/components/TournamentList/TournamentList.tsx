import { Card, CardHeader, Stack, Heading, CardFooter, Button } from '@chakra-ui/react';
import NextLink from 'next/link';

export const TournamentList = ({
  tournaments,
}: {
  tournaments: { id: string; name: string }[];
}) => {
  return (
    <Stack>
      {tournaments?.map((tournament, idx) => (
        <Card key={idx}>
          <CardHeader>
            <Heading size='md' color='gray.700'>{tournament.name}</Heading>
          </CardHeader>
          <CardFooter>
            <Button as={NextLink} href={`/tournaments/${tournament.id}/standings`}>View</Button>
          </CardFooter>
        </Card>
      ))}
    </Stack>
  );
};
