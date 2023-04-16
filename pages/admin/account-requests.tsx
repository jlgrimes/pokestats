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
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AccountRequestCard } from '../../src/components/Admin/AccountRequestCard';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchUnusedPlayers, useAccountRequests } from '../../src/hooks/user';

interface AccountRequestsPageProps {
  unusedPlayers: string[];
}

export default function AccountRequestsPage(props: AccountRequestsPageProps) {
  const { data: userIsAdmin, isLoading: userIsAdminLoading } = useUserIsAdmin();
  const router = useRouter();
  const { data: accountRequests } = useAccountRequests();

  useEffect(() => {
    if (!userIsAdmin && !userIsAdminLoading) {
      router.push('/');
    }
  }, [userIsAdmin, userIsAdminLoading, router]);

  return (
    <Stack>
      <Heading size='sm'>
        {accountRequests?.length} request{accountRequests?.length !== 1 && 's'}
      </Heading>
      {accountRequests?.map((request, idx) => (
        <AccountRequestCard
          request={request}
          key={idx}
          unusedPlayers={props.unusedPlayers}
        />
      ))}
    </Stack>
  );
}

export async function getStaticProps() {
  const unusedPlayers = await fetchUnusedPlayers(true);

  return {
    props: {
      unusedPlayers,
    },
    revalidate: 10,
  };
}
