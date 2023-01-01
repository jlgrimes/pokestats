import MyResults from '../../../pages/tournaments/[id]/my-results';
import { AppLayout } from '../../components/Layout/AppLayout';

const meta = {
  title: 'Pages/MyResults',
  component: MyResults,
};
export default meta;

export const MyResultsPage = () => (
  <AppLayout session={null} dehydratedState={null}>
    <MyResults tournament={{ id: 'mockid', name: 'Mock Regionals 2022' }} />
  </AppLayout>
);
