import { Badge, Heading, Link, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAccountRequests } from '../../hooks/user';

export const AccountRequestLink = ({ onClose }: { onClose: () => void }) => {
  const { data: accountRequests } = useAccountRequests();

  return (
    <Stack direction='row' paddingRight={2} alignItems='center'>
      <Link as={NextLink} href='/admin/account-requests' onClick={onClose}>
        <Heading size='sm'>Access requests</Heading>
      </Link>
      <div>
        <Badge
          fontSize={
            accountRequests && accountRequests.length > 0 ? '2rem' : 'auto'
          }
          ml='1'
          colorScheme={
            accountRequests && accountRequests.length > 0 ? 'red' : 'green'
          }
        >
          {accountRequests?.length}
        </Badge>
      </div>
    </Stack>
  );
};
