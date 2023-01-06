import { SessionProvider } from 'next-auth/react';
import MyResults from '../../../pages/tournaments/[id]/my-results';
import { Tournament } from '../../../types/tournament';
import { AppLayout } from '../../components/Layout/AppLayout';
import { MOCK_AFTER_DAY_1_STANDINGS } from '../../mocks/after-day-1-standings';
import { MOCK_DECK_ARCHETYPES } from '../../mocks/deck-archetypes';
import { MOCK_DURING_DAY_1_STANDINGS } from '../../mocks/during-day-1-standings';
import { MOCK_FINAL_STANDINGS } from '../../mocks/final-standings';
import { MOCK_PLAYER_DECKS } from '../../mocks/player-decks';
import { MOCK_PLAYER_PROFILES } from '../../mocks/player-profiles';

const tournamentId = '0000034';

const commonMockData = [
  {
    url: 'https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Deck%20Archetypes?select=name%2Cdefined_pokemon%2Cidentifiable_cards%2Csupertype',
    method: 'GET',
    status: 200,
    response: MOCK_DECK_ARCHETYPES,
  },
  {
    url: `https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Player Decks?select=player_name,deck_archetype&tournament_id=eq.${tournamentId}`,
    method: 'GET',
    status: 200,
    response: MOCK_PLAYER_DECKS,
  },
  {
    url: 'https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Player Profiles?select=id,name,twitter_handle,tournament_history',
    method: 'GET',
    status: 200,
    response: MOCK_PLAYER_PROFILES
  },
]

const meta = {
  title: 'Pages/MyResults',
  component: MyResults,
};
export default meta;

const session = {
  expires: '1',
  user: {
    id: 'thefleeee',
    username: 'thefleeee',
    name: 'Rahul Reddy',
    profile_image_url:
      'https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg',
  },
}

export const FinalMyResultsPage = () => (
  <SessionProvider
    session={session}
  >
    <AppLayout>
      <MyResults
        tournament={{ id: tournamentId, name: 'Toronto 2022' } as unknown as Tournament}
        session={{ data: session, status: 'loaded'}}
      />
    </AppLayout>
  </SessionProvider>
);

FinalMyResultsPage.parameters = {
  mockData: [
    ...commonMockData,
    {
      url: `/pokedata/standings/${tournamentId}/masters/${tournamentId}_Masters.json`,
      method: 'GET',
      status: 200,
      response: MOCK_FINAL_STANDINGS,
    },
  ]
}

export const AfterDay1MyResultsPage = () => (
  <SessionProvider
    session={session}
  >
    <AppLayout>
      <MyResults
        tournament={{ id: tournamentId, name: 'Toronto 2022' } as unknown as Tournament}
        session={{ data: session, status: 'loaded'}}
      />
    </AppLayout>
  </SessionProvider>
);

AfterDay1MyResultsPage.parameters = {
  mockData: [
    ...commonMockData,
    {
      url: `/pokedata/standings/${tournamentId}/masters/${tournamentId}_Masters.json`,
      method: 'GET',
      status: 200,
      response: MOCK_AFTER_DAY_1_STANDINGS,
    },
  ]
}

export const DuringDay1MyResultsPage = () => (
  <SessionProvider
    session={session}
  >
    <AppLayout>
      <MyResults
        tournament={{ id: tournamentId, name: 'Toronto 2022' } as unknown as Tournament}
        session={{ data: session, status: 'loaded'}}
      />
    </AppLayout>
  </SessionProvider>
);

DuringDay1MyResultsPage.parameters = {
  mockData: [
    ...commonMockData,
    {
      url: `/pokedata/standings/${tournamentId}/masters/${tournamentId}_Masters.json`,
      method: 'GET',
      status: 200,
      response: MOCK_DURING_DAY_1_STANDINGS,
    },
  ]
}