const BASE_URL = 'http://localhost:3000';

/**
 * Should:
 * - Start from the point when no decks are submitted. Ensure that no decks are known.
 * - Do the magic "Add pairings" for a pair. Spy on that request. Ensure that A. two rows getting pushed, B. Player Decks isn't touched.
 * - UI should reflect with both decks known.
 * 
 * Test - deduct decks through submissions
 * - Uses a fixture where we have our previous pairing submission. Mock the supabase call fetching Pairing Submissions.
 * - Do the magic add pairings for a pair where one is in commonality. Ensure that A. two rows should be removed in request body and B. Player Decks is being added with 2 decks.
 * 

 */

describe('template spec', () => {
  before(() => {
    cy.intercept(
      `${BASE_URL}/pokedata/standings/0000037/masters/0000037_Masterstables.json`,
      { fixture: 'pairings.json' }
    );
    cy.intercept(`${BASE_URL}/api/auth/session`, {
      fixture: 'admin-auth.json',
    });
    cy.intercept(
      `https://keujidcnlmekgfajgnjq.supabase.co/rest/v1/Pairing%20Submissions?select=id%2Cdeck_archetype%2Cplayer1_name%2Cplayer2_name%2Cuser_who_submitted%2Ctable_number%2Cround_number&tournament_id=eq.0000037`,
      { fixture: 'pairing-submissions.json' }
    );
  });

  it('passes', () => {
    cy.visit(`${BASE_URL}/tournaments/0000037/pairings`);
  });
});

export {};
