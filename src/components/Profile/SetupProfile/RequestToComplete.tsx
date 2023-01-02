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
import { useEffect, useState } from 'react';
import { ComplainLink } from '../../common/ComplainLink';

export const RequestToComplete = ({ session }: { session: Session }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Heading color='gray.700'>Complete account setup</Heading>
      <Fade in={fadeIn}>
        <Text>{`Please send us a request to finish account setup.`}</Text>
      </Fade>
      <Fade in={fadeIn}>
        <ComplainLink />
      </Fade>
    </Stack>
  );
};
