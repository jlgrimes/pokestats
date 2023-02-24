import {
  Heading,
  Stack,
  Text,
  Button,
  Fade,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useFinalResults } from '../../../hooks/finalResults/finalResults';
import { useTournaments } from '../../../hooks/tournaments';
import supabase from '../../../lib/supabase/client';

export const RecommendedSuggestedUser = ({
  session,
  didNotAttendCallback,
  accountMadeSuccessfullyCallback,
}: {
  session: Session | undefined;
  didNotAttendCallback: () => void;
  accountMadeSuccessfullyCallback: () => void;
}) => {
  const queryClient = useQueryClient();

  const [elementFadedIn, setElementFadedIn] = useState(0);
  const [identityConfirmationLoading, setIdentityConfirmationLoading] =
    useState(false);
  const { data: suggestedUserTournaments } = useFinalResults({
    playerName: session?.user?.name,
  });
  const { data: tournaments } = useTournaments();

  const attendedTournaments = suggestedUserTournaments?.map(standing =>
    tournaments?.find(({ id }) => id === standing.tournamentId)
  );

  const onIdentityConfirmClick = useCallback(async () => {
    if (!session) return;

    setIdentityConfirmationLoading(true);
    await supabase.from('Player Profiles').insert({
      name: session.user?.name,
      email: session.user?.email,
    });

    queryClient.setQueryData(
      [`session-user-profile`, session.user?.email],
      () => ({
        name: session.user?.name,
        email: session.user?.email,
      })
    );
    accountMadeSuccessfullyCallback();
    setIdentityConfirmationLoading(false);
  }, [accountMadeSuccessfullyCallback, queryClient, session]);

  useEffect(() => {
    const firstFade = setTimeout(() => {
      setElementFadedIn(1);
    }, 1000);

    return () => {
      clearTimeout(firstFade);
    };
  }, []);

  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Fade in={elementFadedIn >= 0}>
        <Heading color='gray.700'>{`Complete account setup`}</Heading>
      </Fade>
      <Fade in={elementFadedIn >= 1}>
        <Stack spacing={8}>
          <Heading size='md'>Did you attend the following tournaments?</Heading>
          <List size='xl' color='gray.700'>
            {attendedTournaments?.map((tournament, idx) => (
              <ListItem key={idx}>{tournament?.name}</ListItem>
            ))}
          </List>
          <Text>
            We found someone with your name that has attended these tournaments.
            If this is you, your account setup is done!
          </Text>
        </Stack>
      </Fade>
      <Fade in={elementFadedIn >= 1}>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Button
            variant='solid'
            colorScheme='green'
            leftIcon={<FaCheck />}
            isLoading={identityConfirmationLoading}
            loadingText='Yes I did'
            onClick={onIdentityConfirmClick}
          >
            {`Yes I did`}
          </Button>
          <Button
            variant='outline'
            colorScheme='gray'
            onClick={didNotAttendCallback}
          >
            {`No I did not`}
          </Button>
        </Stack>
      </Fade>
    </Stack>
  );
};
