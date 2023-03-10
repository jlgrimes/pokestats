import { Button, ButtonProps, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo, useCallback } from 'react';
import {
  FaChartLine,
  FaChess,
  FaDice,
  FaDog,
  FaInfo,
  FaInfoCircle,
  FaMagic,
  FaTwitch,
  FaUserFriends,
  FaVideoSlash,
} from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import {
  useStreamLink,
  useTournamentMetadata,
} from '../../hooks/tournamentMetadata';
import { useStreamInfo } from '../../hooks/twitch/useStreamInfo';
import { useSessionUserProfile, useUserIsInTournament } from '../../hooks/user';
import { OpenEditTournamentInfo } from '../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { getRK9TournamentUrl } from './helpers';

export const StreamLink = ({ tournament }: { tournament: Tournament }) => {
  const { data: streamLink } = useStreamLink(tournament.id);
  const { data: streamInfo, isLoading: streamInfoLoading } =
    useStreamInfo(streamLink);

  const getStreamButtonText = useCallback(() => {
    if (!streamLink) return 'No stream';

    if (streamInfo) return 'LIVE';
    return 'Offline';
  }, [streamInfo]);

  return (
    <Button
      variant={streamInfo ? 'solid' : 'ghost'}
      colorScheme={'purple'}
      size='md'
      leftIcon={streamLink ? <FaTwitch /> : <FaVideoSlash />}
      as={NextLink}
      href={streamLink ?? '#'}
      target={streamLink ?? '_blank'}
      isLoading={streamInfoLoading}
      isDisabled={!streamLink}
    >
      {getStreamButtonText()}
    </Button>
  );
};

export const TournamentLinks = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const { data: isAdmin } = useUserIsAdmin();
    const { data: userProfile } = useSessionUserProfile();
    const userIsInTournament = useUserIsInTournament(
      tournament.id,
      userProfile?.name
    );

    const RK9ButtonProps: Partial<ButtonProps> = {
      size: 'md',
      as: NextLink,
      variant: 'outline',
    };

    const tournamentLive = tournament.tournamentStatus === 'running';

    return (
      <HStack>
        {/* {userIsInTournament && (
          <Button
            variant='outline'
            colorScheme={'blue'}
            size='md'
            leftIcon={<FaChartLine />}
            as={NextLink}
            href={parseUsername(userProfile?.email ?? '')}
            target='_blank'
          >
            My results
          </Button>
        )} */}
        <StreamLink tournament={tournament} />
        {/* <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={getRK9TournamentUrl(tournament.rk9link, 'pairings')}
          target='_blank'
        >
          Pairings
        </Button> */}
        {/* <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={`/tournaments/${tournament.id}/pairings`}
        >
          Pairings
        </Button>
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaDice />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Decks
        </Button> */}
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaInfo />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Tournament Info
        </Button>
        {isAdmin && <OpenEditTournamentInfo tournament={tournament} />}
      </HStack>
    );
  }
);

TournamentLinks.displayName = 'TournamentLinks';
