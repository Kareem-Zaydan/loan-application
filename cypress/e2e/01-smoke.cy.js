describe('LendSwift loan application smoke test', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });
    });

    it('loads the multi-step loan application page', () => {
        cy.contains('LendSwift Loan Application').should('be.visible');
        cy.contains('Multi-Step Loan Application Form').should('be.visible');

        cy.contains('Step 1').should('be.visible');
        cy.contains('Loan Type').should('be.visible');

        cy.contains('Personal Information').should('be.visible');
        cy.contains('KYC Verification').should('be.visible');
        cy.contains('Review & Submit').should('be.visible');
    });

    it('shows validation errors when trying to continue without Step 1 data', () => {
        cy.contains('button', 'Next').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
        cy.get('[role="alert"]').first().should('be.visible');
    });
});