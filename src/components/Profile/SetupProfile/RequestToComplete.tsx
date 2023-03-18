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
  Input,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaSearch, FaSkull } from 'react-icons/fa';
import {
  SessionUserProfile,
  useSessionUserProfile,
  useUserSentAccountRequest,
} from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { useTwitterLink } from '../../../hooks/twitter';
import { fetchFinalResults } from '../../../hooks/finalResults/fetch';
import { useRouter } from 'next/router';

export const RequestToComplete = ({
  userProfile,
}: {
  userProfile: SessionUserProfile | undefined;
}) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fullNameVal, setFullNameVal] = useState('');
  const { data: userSentRequest } = useUserSentAccountRequest(
    userProfile?.email
  );
  const toast = useToast();
  const { refetch } = useSessionUserProfile();
  const router = useRouter();
  const [requestSentStatus, setRequestSentStatus] =
    useState<'before' | 'sending' | 'sent' | 'sent-error' | 'succeed'>('before');

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

    const finalResultsWithPlayerName = await fetchFinalResults({
      playerName: fullNameVal,
    });

    if (finalResultsWithPlayerName && finalResultsWithPlayerName?.length > 0) {
      await supabase.from('Player Profiles').insert({
        name: fullNameVal,
        email: userProfile?.email,
      });

      await refetch();
      setRequestSentStatus('succeed');

      return toast({
        status: 'success',
        title: 'Account successfully created!',
      });
    }

    const { data, error } = await supabase.from('Account Requests').insert([
      {
        email: userProfile?.email,
        name: userProfile?.name,
        entered_name: fullNameVal,
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
      <Fade in={fadeIn}>
        <Stack spacing={6}>
          <Heading color='gray.700'>Complete account setup</Heading>
          {/* <Text as='b'>{`Make sure your Google account name matches your RK9 account name.`}</Text> */}
          <Text>
            Please enter your full name <b>exactly as it shows on RK9.</b>
          </Text>
          {/* <Box>
            {`If you're stuck on this page for a while, contact `}
            <Link
              isExternal
              href={useTwitterLink('jgrimesey')}
              as={NextLink}
              color='twitter.500'
            >
              @jgrimesey
            </Link>
            {` and we can figure this out. `}
          </Box> */}
          {/* <Flex flexWrap='wrap' gap={2} alignItems='baseline'>
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
          </Flex> */}
          <Input
            placeholder='Full name as it shows on RK9'
            value={fullNameVal}
            onChange={e => setFullNameVal(e.target.value)}
          />
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <Button
              colorScheme={'gray'}
              variant='solid'
              leftIcon={
                requestSentStatus === 'sent' ? (
                  <FaCheck />
                ) : requestSentStatus === 'sent-error' ? (
                  <FaSkull />
                ) : undefined
              }
              isLoading={requestSentStatus === 'sending'}
              loadingText='Submit'
              isDisabled={
                requestSentStatus === 'sent' ||
                requestSentStatus === 'sent-error' ||
                requestSentStatus === 'succeed' ||
                fullNameVal.length === 0
              }
              onClick={handleSendRequest}
            >
              {requestSentStatus === 'sent'
                ? 'Request sent!'
                : requestSentStatus === 'sent-error'
                ? 'Something went wrong'
                : requestSentStatus === 'succeed'
                ? 'Account created!'
                : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      </Fade>
    </Stack>
  );
};
