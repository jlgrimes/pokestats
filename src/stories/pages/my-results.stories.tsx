import { QueryClientProvider } from '@tanstack/react-query';
import MyResults from '../../../pages/tournaments/[id]/my-results';
import App from '../../../pages/_app';
import { AppLayout } from '../../components/Layout/AppLayout';

const meta = {
  title: 'Pages/Home',
  component: MyResults,
};
export default meta;

export const HomePage = () => (
  <AppLayout session={null} dehydratedState={null}>
    <MyResults tournament={{ id: 'mockid', name: 'Mock Regionals 2022' }} />
  </AppLayout>
);
