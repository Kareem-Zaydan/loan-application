describe('Step 1 - Loan Type', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });
    });

    it('allows the user to complete Step 1 and move to Step 2', () => {
        cy.contains('Step 1').should('be.visible');
        cy.contains('Loan Type').should('be.visible');

        cy.get('input[name="loanType"][value="personal"]').check({ force: true });

        cy.get('input[name="loanAmount"]').clear().type('300000');

        cy.get('select[name="tenureMonths"]').select('24');

        cy.get('select[name="loanPurpose"]').select('medical');

        cy.contains('button', 'Next').click();

        cy.contains('Step 2').should('be.visible');
        cy.contains('Personal Information').should('be.visible');
    });

    it('preserves Step 1 data when going back from Step 2', () => {
        cy.get('input[name="loanType"][value="personal"]').check({ force: true });
        cy.get('input[name="loanAmount"]').clear().type('300000');
        cy.get('select[name="tenureMonths"]').select('24');
        cy.get('select[name="loanPurpose"]').select('medical');

        cy.contains('button', 'Next').click();
        cy.contains('Step 2').should('be.visible');

        cy.contains('button', 'Previous').click();

        cy.contains('Step 1').should('be.visible');

        cy.get('input[name="loanType"][value="personal"]').should('be.checked');

        cy.get('input[name="loanAmount"]')
            .invoke('val')
            .then((value) => {
                expect(value.replace(/,/g, '')).to.eq('300000');
            });

        cy.get('select[name="tenureMonths"]').should('have.value', '24');
        cy.get('select[name="loanPurpose"]').should('have.value', 'medical');
    });
});