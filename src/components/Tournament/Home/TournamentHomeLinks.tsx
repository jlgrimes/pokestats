import { Button, Grid } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FaTwitch } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useStreamLink } from '../../../hooks/tournamentMetadata';
import { getRK9TournamentUrl } from '../helpers';

interface TournamentHomeLinksProps {
  tournament: Tournament;
}

export const TournamentHomeLinks = (props: TournamentHomeLinksProps) => {
  const commonProps = useMemo(
    () => ({
      as: NextLink,
      colorScheme: 'gray',
    }),
    []
  );
  const streamLink = useStreamLink(props.tournament.id);
  const router = useRouter();

  return (
    <Grid gridTemplateColumns='1fr 1fr' gap={2} rowGap={2}>
      {streamLink && (
        <Button
          {...commonProps}
          colorScheme='purple'
          leftIcon={<FaTwitch />}
          href={streamLink.data}
          target='_blank'
        >
          Stream
        </Button>
      )}
      <Button
        {...commonProps}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Tournament Info
      </Button>
      <Button {...commonProps} href={`${router.asPath}/standings`} isDisabled={props.tournament.tournamentStatus === 'not-started'}>
        Standings
      </Button>
      <Button {...commonProps} href={`${router.asPath}/pairings`} isDisabled={props.tournament.tournamentStatus === 'not-started'}>
        Pairings
      </Button>
    </Grid>
  );
};
