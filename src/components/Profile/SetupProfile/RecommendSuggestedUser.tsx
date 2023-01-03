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
import { useTournaments } from '../../../hooks/tournaments';
import { useSuggestedUserProfile } from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';

export const RecommendedSuggestedUser = ({
  session,
  didNotAttendCallback,
  accountMadeSuccessfullyCallback,
}: {
  session: Session;
  didNotAttendCallback: () => void;
  accountMadeSuccessfullyCallback: () => void;
}) => {
  const queryClient = useQueryClient();

  const [elementFadedIn, setElementFadedIn] = useState(0);
  const [identityConfirmationLoading, setIdentityConfirmationLoading] =
    useState(false);
  const { data: suggestedUser } = useSuggestedUserProfile();
  const { data: tournaments } = useTournaments();

  const attendedTournaments = useMemo(
    () =>
      suggestedUser?.tournament_history.map(
        id => tournaments?.find(tournament => tournament.id === id)?.name
      ),
    [suggestedUser?.tournament_history, tournaments]
  );

  const onIdentityConfirmClick = useCallback(async () => {
    setIdentityConfirmationLoading(true);
    await supabase
      .from('Player Profiles')
      .update({
        twitter_handle: session.user.username,
      })
      .eq('name', session.user.name);

    queryClient.setQueryData(
      [`session-user-profile`, session.user.username],
      () => ({
        name: session.user.name,
        username: session.user.username,
      })
    );
    accountMadeSuccessfullyCallback();
    setIdentityConfirmationLoading(false);
  }, []);

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
              <ListItem key={idx}>{tournament}</ListItem>
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
