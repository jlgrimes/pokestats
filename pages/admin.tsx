import { Flex } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import ResultInputForm from '../src/components/Admin/ResultInputForm';

export default function Admin() {
  return (
    <Flex flexDirection={'column'}>
      <ResultInputForm />
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
