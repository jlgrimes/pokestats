import { Badge, IconButton, Link, Stack } from '@chakra-ui/react';
import { FaIdBadge } from 'react-icons/fa';
import { useAccountRequests } from '../../hooks/user';

export const AdminLinks = () => {
  const { data: accountRequests } = useAccountRequests();

  return (
    <Stack
      direction='row'
      alignItems={'baseline'}
      spacing={-4}
      paddingRight={2}
    >
      <IconButton
        variant={'ghost'}
        aria-label='Manage access requests'
        icon={<FaIdBadge />}
        as={Link}
        href='/admin/account-requests'
      />
      <div>
        {accountRequests && accountRequests?.length > 0 && (
          <Badge ml='1' colorScheme={'red'}>
            {accountRequests?.length}
          </Badge>
        )}
      </div>
    </Stack>
  );
};
