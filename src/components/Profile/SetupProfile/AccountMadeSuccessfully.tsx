import { Heading, Stack, Text, Fade, Button, Link } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export const AccountMadeSuccessfully = ({
  session,
}: {
  session: Session | null;
}) => {
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
        <Heading
          size='lg'
          color='gray.700'
        >{`Your account was set up successfully!`}</Heading>
      </Fade>
      <Fade in={fadeIn}>
        <Button
          as={Link}
          variant='solid'
          rightIcon={<FaArrowRight />}
          href={`/player/${session?.user.username}`}
        >
          {`Go to my profile`}
        </Button>
      </Fade>
    </Stack>
  );
};
