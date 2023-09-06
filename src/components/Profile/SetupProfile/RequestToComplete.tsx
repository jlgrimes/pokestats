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
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaSearch, FaSkull } from 'react-icons/fa';
import {
  fetchUnusedPlayers,
  normalizeName,
  SessionUserProfile,
  useNotSetupProfiles,
  useSessionPlayerProfile,
  useUserSentAccountRequest,
} from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';
import { useTwitterLink } from '../../../hooks/twitter';
import { User } from '@supabase/supabase-js';

export const RequestToComplete = ({
  userProfile,
}: {
  userProfile: User | undefined;
}) => {
  const { colorMode } = useColorMode();

  const [fadeIn, setFadeIn] = useState(false);
  const [fullNameVal, setFullNameVal] = useState('');
  const { data: userSentRequest } = useUserSentAccountRequest(
    userProfile?.email
  );
  const toast = useToast();
  const { refetch } = useSessionPlayerProfile();
  const [requestSentStatus, setRequestSentStatus] =
    useState<'before' | 'sending' | 'sent' | 'sent-error' | 'succeed'>(
      'before'
    );
  const myTwitter = useTwitterLink('jgrimesey');

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

    const unusedNames = await fetchUnusedPlayers();
    const finalResultsName = unusedNames?.find(
      name => normalizeName(name) === normalizeName(fullNameVal)
    );

    try {
      await supabase
        .from('Account Requests')
        .delete()
        .eq('email', userProfile?.email);

      await supabase.from('Player Profiles').insert({
        name: finalResultsName || fullNameVal,
        email: userProfile?.email,
      });

      await refetch();
      setRequestSentStatus('succeed');

      return toast({
        status: 'success',
        title: 'Account successfully created!',
      });
    } catch {
      return toast({
        status: 'error',
        title: 'Something went wrong.',
      });
    }
  };

  return (
    <Stack padding='1.5rem' spacing={10} justifyContent='space-between'>
      <Fade in={fadeIn}>
        <Stack spacing={6}>
          <Heading color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}>
            Complete account setup
          </Heading>
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
            value={fullNameVal || userSentRequest || ''}
            onChange={e => setFullNameVal(e.target.value)}
            isDisabled={requestSentStatus === 'sent'}
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
          {requestSentStatus === 'sent' && (
            <Stack>
              <Text>{`We couldn't find anyone with that name on RK9. `}</Text>
              <Box>
                {`We went ahead and made a request for you. In the meantime, you can message `}
                <Link
                  isExternal
                  href={myTwitter}
                  as={NextLink}
                  color='twitter.500'
                >
                  @jgrimesey
                </Link>
                {` on Twitter and we can figure this out.`}
              </Box>
            </Stack>
          )}
        </Stack>
      </Fade>
    </Stack>
  );
};
