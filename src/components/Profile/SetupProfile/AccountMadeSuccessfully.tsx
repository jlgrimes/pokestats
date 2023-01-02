import { Heading, Stack, Text, Fade, Button, Link } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export const AccountMadeSuccessfully = () => {
  const session = useSession();
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
      <Heading color='gray.700'>Account setup completed</Heading>
      <Fade in={fadeIn}>
        <Text>{`Your account was set up successfully!`}</Text>
      </Fade>
      <Fade in={fadeIn}>
        <Button
          as={Link}
          variant='solid'
          rightIcon={<FaArrowRight />}
          href={`/player/${session.data?.user.username}`}
        >
          {`Go to my profile`}
        </Button>
      </Fade>
    </Stack>
  );
};
