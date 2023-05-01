import { Badge } from '@chakra-ui/react';
import { memo, useContext } from 'react';
import { userMockContext } from '../../contexts/MockUserContext';

export const AdminBadge = memo(() => {
  const { shouldMockUser, setShouldMockUser } = useContext(userMockContext);

  return (
    <Badge
      colorScheme={shouldMockUser ? 'blue' : 'pink'}
      marginLeft={2}
      onClick={() => setShouldMockUser(!shouldMockUser)}
    >
      {shouldMockUser ? 'User' : 'God'}
    </Badge>
  );
});

AdminBadge.displayName = 'AdminBadge';
