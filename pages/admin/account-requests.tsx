import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardHeader,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AccountRequestCard } from '../../src/components/Admin/AccountRequestCard';
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
      <Heading size='sm'>
        {accountRequests?.length} request{accountRequests?.length !== 1 && 's'}
      </Heading>
      {accountRequests?.map((request, idx) => (
        <AccountRequestCard request={request} key={idx} />
      ))}
    </Stack>
  );
}
