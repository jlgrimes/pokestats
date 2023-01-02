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
import { getFirstName } from '../helpers';

export const RecommendedSuggestedUser = ({ session }: { session: Session }) => {
  const [elementFadedIn, setElementFadedIn] = useState(0);
  const { data: suggestedUser } = useSuggestedUserProfile();
  const { data: tournaments } = useTournaments();

  const firstName = useMemo(() => getFirstName(session), [session]);

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
