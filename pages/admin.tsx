import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, Heading, Highlight, Link, Text } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import ResultForm from '../src/components/Admin/ResultForm';
import ResultsList from '../src/components/Results/ResultsList/ResultsList';
import supabase from '../src/lib/supabase/client';

export default function Admin({ userIsAdmin }: { userIsAdmin: boolean }) {
  if (!userIsAdmin) {
    return (
      <Flex
        height={'100%'}
        width={'100%'}
        justifyContent='center'
        direction={'column'}
        gap={'1.5rem'}
      >
        <Heading size={'3xl'}>{`Sorry, you can't be here!`}</Heading>
        <Text fontSize={'xl'}>
          <Highlight
            query='stats team only.'
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
          >
            This is page for the stats team only. Get lost! 
          </Highlight>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection={'column'}>
      <ResultForm />
      <ResultsList />
    </Flex>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { data: administratorList } = await supabase
    .from('Administrators')
    .select('*');
  const userIsAdmin = administratorList?.some(
    admin => admin.email === session.user?.email
  );

  return {
    props: { userIsAdmin },
  };
}
