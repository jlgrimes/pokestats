import { Badge, IconButton, Link, Stack } from '@chakra-ui/react';
import { FaRegIdBadge, FaUsersCog } from 'react-icons/fa';
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
        color='gray.700'
        variant={'ghost'}
        aria-label='Manage access requests'
        icon={<FaUsersCog />}
        margin='-1'
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
