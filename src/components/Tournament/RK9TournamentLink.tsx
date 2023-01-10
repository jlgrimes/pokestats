import { Tournament } from '../../../types/tournament';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

export const RK9TournamentLink = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  return (
    <Link
      as={NextLink}
      href={`https://rk9.gg/tournament/${tournament.rk9link}`}
      isExternal
    >
      <Icon as={FaExternalLinkAlt} mx='8px' boxSize={4} />
    </Link>
  );
};
