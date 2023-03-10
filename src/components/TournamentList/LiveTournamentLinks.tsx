import { Button, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { StreamLink } from '../Tournament/TournamentLinks';

interface LiveTournamentLinksProps {
  tournament: Tournament;
}

export const LiveTournamentLinks = (props: LiveTournamentLinksProps) => {
  return (
    <HStack justifyContent={'space-between'}>
      <Button
        as={NextLink}
        href={`/tournaments/${props.tournament.id}`}
        variant='ghost'
        rightIcon={<FaArrowRight />}
        paddingX={1}
      >
        Follow live
      </Button>
      <StreamLink tournament={props.tournament} />
    </HStack>
  );
};
