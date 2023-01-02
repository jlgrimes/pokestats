import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
  Fade,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useTournaments } from '../../../hooks/tournaments';
import { useSuggestedUserProfile } from '../../../hooks/user';

export const RecommendedSuggestedUser = ({
  session,
  didNotAttendCallback,
}: {
  session: Session;
  didNotAttendCallback: () => void;
}) => {
  const [elementFadedIn, setElementFadedIn] = useState(0);
  const { data: suggestedUser } = useSuggestedUserProfile();
  const { data: tournaments } = useTournaments();

  const attendedTournaments = useMemo(
    () =>
      suggestedUser?.tournamentHistory.map(
        id => tournaments?.data?.find(tournament => tournament.id === id)?.name
      ),
    [suggestedUser?.tournamentHistory, tournaments?.data]
  );

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
        <Stack>
          <Heading
            size='lg'
            color='gray.700'
          >{`Did you attend ${attendedTournaments?.join(', ')}?`}</Heading>
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
            onClick={() => console.log('hi')}
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
