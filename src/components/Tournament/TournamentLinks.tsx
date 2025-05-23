import { Box, Button, ButtonProps, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo, useCallback } from 'react';
import { FaInfo, FaTwitch, FaVideoSlash } from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import {
  useStreamLink,
} from '../../hooks/tournamentMetadata';
import {
  ID_MAP_UNREGISTERED,
  useStreamInfo,
} from '../../hooks/twitch/useStreamInfo';
import { useSessionPlayerProfile } from '../../hooks/user';
import { OpenEditTournamentInfo } from '../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { getRK9TournamentUrl } from './helpers';
import { trackEvent } from '../../lib/track';

export const StreamIconLink = ({ tournament }: { tournament: Tournament }) => {
  const { data: streamLink, isLoading: streamLinkLoading } = useStreamLink(tournament);

  return (
    <Box>
      <IconButton
        variant={streamLink ? 'solid' : 'ghost'}
        colorScheme={'purple'}
        size='md'
        icon={streamLink ? <FaTwitch /> : <FaVideoSlash />}
        aria-label='stream'
        as={NextLink}
        href={streamLink ?? '#'}
        target={streamLink ?? '_blank'}
        isLoading={streamLinkLoading}
        isDisabled={!streamLink}
        onClick={() => trackEvent('Stream link clicked')}
      />
    </Box>
  );
};

export const StreamLink = ({ tournament }: { tournament: Tournament }) => {
  const { data: streamLink, isLoading: streamLinkLoading } = useStreamLink(tournament);
  const { data: streamInfo, isLoading: streamInfoLoading } =
    useStreamInfo(streamLink);

  const getStreamButtonText = useCallback(() => {
    if (!streamLink) return 'No stream';

    return 'Stream';

    if (streamInfo === ID_MAP_UNREGISTERED) return 'Stream';

    if (streamInfo) return 'LIVE';
    return 'Offline';
  }, [streamLink, streamInfo]);

  return (
    <Button
      variant={streamLink ? 'solid' : 'ghost'}
      colorScheme={'purple'}
      size='md'
      leftIcon={streamLink ? <FaTwitch /> : <FaVideoSlash />}
      as={NextLink}
      href={streamLink ?? '#'}
      target={streamLink ?? '_blank'}
      isLoading={streamLinkLoading}
      isDisabled={!streamLink}
    >
      {getStreamButtonText()}
    </Button>
  );
};

export const TournamentLinks = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const { data: isAdmin } = useUserIsAdmin();
    const { data: userProfile } = useSessionPlayerProfile();

    const RK9ButtonProps: Partial<ButtonProps> = {
      size: 'md',
      as: NextLink,
      variant: 'outline',
    };

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
