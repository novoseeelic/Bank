/// <reference types="cypress" />

describe('Банковская система хранения и операций над криптовалютными средствами.', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.login-input').type('developer').should('have.value', 'developer');
    cy.get('.password-input').type('skillbox').should('have.value', 'skillbox');
    cy.get('.form__btn').should('be.visible').click();
  });

  it('Вход в личный кабинет', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: {
        login: 'developer',
        password: 'skillbox',
      },
    }).then((response) => {
      expect(response).to.have.property('status', 200);
      cy.request({
        method: 'GET',
        url: 'http://localhost:3000/accounts',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Basic ${response.body.payload.token}`,
        },
      }).then((response) => {
        expect(response).to.have.property('status', 200);
        expect(response.body).to.not.be.null;
      });
    });
    cy.reload();

  });
});
