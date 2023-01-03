import { Card, CardHeader, Heading, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { useAccountRequests } from '../../src/hooks/user';

export default function AccountRequestsPage() {
  const userIsAdmin = useUserIsAdmin();
  const router = useRouter();
  const { data: accountRequests } = useAccountRequests();

  useEffect(() => {
    if (!userIsAdmin) {
      router.push('/');
    }
  }, []);

  return (
    <Stack padding='0.5rem 1.5rem'>
      <Heading size='sm'>{accountRequests?.length} request{accountRequests?.length !== 1 && 's'}</Heading>
      {accountRequests?.map((request, idx) => (
        <Card key={idx}>
          <CardHeader>
            <Heading size={'md'}>{request.twitter_handle}</Heading>
            <Text>Name on Twitter: {request.twitter_full_name}</Text>
          </CardHeader>
        </Card>
      ))}
    </Stack>
  );
}
