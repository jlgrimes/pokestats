const BASE_URL = 'http://localhost:3000';

describe('template spec', () => {
  before(() => {
    cy.intercept(
      `${BASE_URL}/pokedata/standings/0000037/masters/0000037_Masterstables.json`,
      { fixture: 'pairings.json' }
    );
    cy.intercept(`${BASE_URL}/api/auth/session`, {
      fixture: 'admin-auth.json',
    });
  });

  it('passes', () => {
    cy.visit(`${BASE_URL}/tournaments/0000037/pairings`);
  });
});

export {};
