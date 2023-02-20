import { Badge } from '@chakra-ui/react';
import { memo } from 'react';

export const AdminBadge = memo(() => (
  <Badge colorScheme={'pink'} marginLeft={2}>
    Admin
  </Badge>
));

AdminBadge.displayName = 'AdminBadge';
