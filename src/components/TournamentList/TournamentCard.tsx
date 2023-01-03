import {
  Card,
  CardHeader,
  Stack,
  Heading,
  CardFooter,
  Button,
  LinkOverlay,
  CardBody,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  LinkBox,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export const TournamentCard = ({
  tournament,
}: {
  tournament: Record<string, any>;
}) => {
  return (
    <LinkBox>
      <Card>
        <Stack padding='1rem 1.5rem'>
          <LinkOverlay
            as={NextLink}
            href={`/tournaments/${tournament.id}/standings`}
          >
            <Heading size='md' color='gray.700'>
              {tournament.name}
            </Heading>
          </LinkOverlay>

        </Stack>
      </Card>
    </LinkBox>
  );
};
