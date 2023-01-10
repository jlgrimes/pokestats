import { Tournament } from '../../../types/tournament';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getRK9TournamentUrl } from './helpers';


export const RK9TournamentLink = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  return (
    <Link
      as={NextLink}
      href={getRK9TournamentUrl(tournament.rk9link)}
      isExternal
    >
      <Icon as={FaExternalLinkAlt} mx='8px' boxSize={4} />
    </Link>
  );
};
