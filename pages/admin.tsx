import { Flex } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import ResultForm from '../src/components/Admin/ResultForm';
import ResultsList from '../src/components/Results/ResultsList/ResultsList';

export default function Admin() {
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
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
