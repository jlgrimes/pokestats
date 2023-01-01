import { SessionProvider } from 'next-auth/react';
import MyResults from '../../../pages/tournaments/[id]/my-results';
import { AppLayout } from '../../components/Layout/AppLayout';

const meta = {
  title: 'Pages/MyResults',
  component: MyResults,
};
export default meta;

export const MyResultsPage = () => (
  <SessionProvider
    session={{
      expires: '1',
      user: {
        id: 'pokelover',
        username: 'pokelover',
        name: 'Chad Chaddington',
        profile_image_url: 'https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg',
      },
    }}
  >
    <AppLayout dehydratedState={null}>
      <MyResults tournament={{ id: 'mockid', name: 'Mock Regionals 2022' }} />
    </AppLayout>
  </SessionProvider>
);
