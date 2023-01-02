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
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useTournaments } from '../../hooks/tournaments';
import { useSuggestedUserProfile } from '../../hooks/user';

export const RecommendedSuggestedUser = () => {
  const [elementFadedIn, setElementFadedIn] = useState(0);
  const session = useSession();
  const { data: suggestedUser } = useSuggestedUserProfile();
  const { data: tournaments } = useTournaments();

  const firstName = useMemo(
    () => session.data?.user.name?.split(' ')?.[0],
    [session.data?.user.name]
  );

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
    <Stack padding='1.5rem' spacing={8} justifyContent='center'>
      <Fade in={elementFadedIn >= 0}>
        <Heading color='gray.700'>{`Let's set up your profile, ${firstName}`}</Heading>
      </Fade>
      <Fade in={elementFadedIn >= 1}>
        <Text fontSize={'lg'}>{`Did you attend ${attendedTournaments?.join(
          ', '
        )}?`}</Text>
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
            onClick={() => console.log('hi')}
          >
            {`No I did not`}
          </Button>
        </Stack>
      </Fade>
    </Stack>
  );
};
