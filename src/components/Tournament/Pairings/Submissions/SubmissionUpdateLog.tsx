import { Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Banner } from '../../../common/Banner';

export const SubmissionUpdateLog = ({ updates }: { updates: string[] }) => {
  return (
    <Banner>
      <Fragment>
        {updates.map(update => (
          <Text key={update}>{update}</Text>
        ))}
      </Fragment>
    </Banner>
  );
};
