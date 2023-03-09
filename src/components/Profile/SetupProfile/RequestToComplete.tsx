import {
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  Fade,
  Flex,
  Link,
  Box,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaSkull } from 'react-icons/fa';
import {
  SessionUserProfile,
  useUserSentAccountRequest,
} from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { useTwitterLink } from '../../../hooks/twitter';

export const RequestToComplete = ({
  userProfile,
}: {
  userProfile: SessionUserProfile | undefined;
}) => {
  const [fadeIn, setFadeIn] = useState(false);
  const { data: userSentRequest } = useUserSentAccountRequest(
    userProfile?.email
  );
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
    const { data, error } = await supabase.from('Account Requests').insert([
      {
        email: userProfile?.email,
        name: userProfile?.name,
      },
    ]);
    if (error) {
      setRequestSentStatus('sent-error');
    } else {
      setRequestSentStatus('sent');
    }
  };

  return (
    <Stack padding='1.5rem' spacing={10} justifyContent='space-between'>
      <Heading color='gray.700'>Complete account setup</Heading>
      <Fade in={fadeIn}>
        <Stack>
          <Text as='b'>{`Make sure your Google account name matches your RK9 account name.`}</Text>
          <Box>
            {`We were unable to find you - please send us a request. If you have never attended a tournament, refresh this page once your first tournament is underway. If you have attended a tournament before, send a request + contact me `}
            <Link
              isExternal
              href={useTwitterLink('jgrimseey')}
              as={NextLink}
              color='twitter.500'
            >
              @jgrimesey
            </Link>
            {` and we can figure this out. `}
          </Box>
          <Flex flexWrap='wrap' gap={2} alignItems='baseline'>
            <Box>
              {`Once your request is approved, you'll see the badge next to your profile pic changed from`}{' '}
              <Box paddingX={2} display='inline'>
                <NotVerifiedIcon />
              </Box>
              to
              <Box paddingX={2} display='inline'>
                <VerifiedIcon />
              </Box>
            </Box>
          </Flex>
        </Stack>
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
            isDisabled={
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
