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
import { FaCheck, FaEnvelope, FaSkull } from 'react-icons/fa';
import { useUserSentAccountRequest } from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';

export const RequestToComplete = ({ session }: { session: Session }) => {
  const [fadeIn, setFadeIn] = useState(false);
  const { data: userSentRequest } = useUserSentAccountRequest(session.user.username);
  const [requestSentStatus, setRequestSentStatus] =
    useState<'before' | 'sending' | 'sent' | 'sent-error'>('before');

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (userSentRequest) {
      setRequestSentStatus('sent');
    }
  }, [userSentRequest]);

  const handleSendRequest = async () => {
    setRequestSentStatus('sending');
    const { data, error } = await supabase
      .from('Account Requests')
      .insert([{ twitter_handle: session.user.username }]);
    if (error) {
      setRequestSentStatus('sent-error');
    } else {
      setRequestSentStatus('sent');
    }
  };

  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Heading color='gray.700'>Complete account setup</Heading>
      <Fade in={fadeIn}>
        <Text>{`Send us a request to complete account setup. If you've already sent a request, hang tight!`}</Text>
      </Fade>
      <Fade in={fadeIn}>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Button
            colorScheme={'gray'}
            variant='solid'
            leftIcon={
              requestSentStatus === 'sent' ? (
                <FaCheck />
              ) : requestSentStatus === 'sent-error' ? (
                <FaSkull />
              ) : (
                <FaEnvelope />
              )
            }
            isLoading={requestSentStatus === 'sending'}
            loadingText='Send a request'
            disabled={
              requestSentStatus === 'sent' || requestSentStatus === 'sent-error'
            }
            onClick={handleSendRequest}
          >
            {requestSentStatus === 'sent'
              ? 'Request sent!'
              : requestSentStatus === 'sent-error'
              ? 'Something went wrong'
              : 'Send a request'}
          </Button>
        </Stack>
      </Fade>
    </Stack>
  );
};
