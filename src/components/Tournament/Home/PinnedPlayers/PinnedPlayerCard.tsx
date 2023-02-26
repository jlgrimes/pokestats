import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment, useCallback } from 'react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import {
  deletePinnedPlayer,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

interface PinnedPlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  const session = useSession();
  const toast = useToast();
  const { refetch } = usePinnedPlayers(props.tournament.id);
  const { data: userIsAdmin } = useUserIsAdmin();

  const onUnpinPlayer = useCallback(async () => {
    if (!session.data?.user?.email) {
      return toast({
        status: 'error',
        title: 'Session invalid',
      });
    }

    const res = await deletePinnedPlayer(
      session.data.user.email,
      props.player.name
    );

    if (res.error) {
      return toast({
        status: 'error',
        title: `Error unpinning ${props.player.name}`,
        description: res.error.message,
      });
    }

    await refetch();
  }, [props.player.name, session.data?.user?.email, toast, refetch]);

  return (
    <Card>
      <CardBody paddingX={0} paddingY={2}>
        <Stack spacing={0}>
          <StandingsRow
            result={props.player}
            tournament={props.tournament}
            onUnpinPlayer={onUnpinPlayer}
            canEditDecks={userIsAdmin}
            shouldHideDeck={props.shouldHideDecks}
          />
          {props.player.currentOpponent && (
            <Fragment>
              <Heading
                paddingLeft='2.65rem'
                color='gray.400'
                fontSize={14}
                textTransform='uppercase'
              >
                vs
              </Heading>
              <StandingsRow
                result={props.player.currentOpponent}
                tournament={props.tournament}
                canEditDecks={userIsAdmin}
                shouldHideDeck={props.shouldHideDecks}
                translucent
              />
            </Fragment>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};
