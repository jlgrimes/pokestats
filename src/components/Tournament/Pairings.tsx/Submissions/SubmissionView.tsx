import { HStack } from '@chakra-ui/react';

export const SubmissionView = ({ isUserAdmin }: { isUserAdmin: boolean }) => {
  if (!isUserAdmin) return null;

  return <HStack></HStack>;
};
