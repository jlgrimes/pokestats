import { SessionProvider } from 'next-auth/react';
import MyResults from '../../../pages/tournaments/[id]/my-results';
import { AppLayout } from '../../components/Layout/AppLayout';
import { MOCK_DECK_ARCHETYPES } from '../../mocks/deck-archetypes';
import { MOCK_FINAL_STANDINGS } from '../../mocks/final-standings';
import { MOCK_PLAYER_PROFILES } from '../../mocks/player-profiles';

const meta = {
  title: 'Pages/MyResults',
  component: MyResults,
  parameters: {
    mockData: [
      {
        url: '/pokedata/standings/0000034/masters/0000034_Masters.json',
        method: 'GET',
        status: 200,
        response: MOCK_FINAL_STANDINGS,
      },
      {
        url: 'https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Deck%20Archetypes?select=name%2Cdefined_pokemon%2Cidentifiable_cards%2Csupertype',
        method: 'GET',
        status: 200,
        response: MOCK_DECK_ARCHETYPES,
      },
      {
        url: 'https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Player Decks?select=player_name,deck_archetype&tournament_id=eq.0000034',
        method: 'GET',
        status: 200,
        response: [{"player_name":"Stephen Palombo","deck_archetype":"Lugia VSTAR/Archeops"}, 
          {"player_name":"Ryan Shore","deck_archetype":"Lost Box (Kyogre)"}, 
          {"player_name":"Solomon Shurge","deck_archetype":"Lost Box (Rayquaza)"}, 
          {"player_name":"Jared Grimes","deck_archetype":"Lost Box (Kyogre)"}, 
          {"player_name":"Tim Tipton","deck_archetype":"Eternatus Weezing"}, 
          {"player_name":"Noah Spinale","deck_archetype":"Lost Box (Charizard)"}, 
          {"player_name":"Anthony Salomone","deck_archetype":"Lugia VSTAR/Archeops"}, 
          {"player_name":"Tyler Mathews","deck_archetype":"Lost Box (Rayquaza)"}, 
          {"player_name":"Ian Morgan","deck_archetype":"Lugia VSTAR/Archeops"}, 
          {"player_name":"Lorenzo Menendez","deck_archetype":"Lost Box (Kyogre)"}, 
          {"player_name":"Jordan de Souza","deck_archetype":"Fusion Mew"}],
      },
      {
        url: 'https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Player Profiles?select=id,name,twitter_handle,tournament_history',
        method: 'GET',
        status: 200,
        response: MOCK_PLAYER_PROFILES
      },
    ],
  },
};
export default meta;

export const MyResultsPage = () => (
  <SessionProvider
    session={{
      expires: '1',
      user: {
        id: 'pokelover',
        username: 'jgrimesey',
        name: 'Jared Grimes',
        profile_image_url:
          'https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg',
      },
    }}
  >
    <AppLayout>
      <MyResults
        tournament={{ id: '0000034', name: 'Mock Regionals 2022' }}
      />
    </AppLayout>
  </SessionProvider>
);
