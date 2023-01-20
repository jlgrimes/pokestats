import { Button, ButtonProps, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import {
  FaChess,
  FaDog,
  FaInfo,
  FaInfoCircle,
  FaMagic,
  FaTwitch,
  FaUserFriends,
} from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { getRK9TournamentUrl } from './helpers';

export const TournamentLinks = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const RK9ButtonProps: Partial<ButtonProps> = {
      variant: 'outline',
      colorScheme: 'orange',
      size: 'sm',
      as: NextLink,
    };

    return (
      <HStack>
        {/* <Button
          variant={'solid'}
          colorScheme={'purple'}
          size='sm'
          leftIcon={<FaTwitch />}
          as={NextLink}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Stream
        </Button> */}
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={getRK9TournamentUrl(tournament.rk9link, 'pairings')}
          target='_blank'
        >
          Pairings
        </Button>
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaUserFriends />}
          href={getRK9TournamentUrl(tournament.rk9link, 'roster')}
          target='_blank'
        >
          Roster
        </Button>
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaInfoCircle />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Details
        </Button>
      </HStack>
    );
  }
);

TournamentLinks.displayName = 'TournamentLinks';
