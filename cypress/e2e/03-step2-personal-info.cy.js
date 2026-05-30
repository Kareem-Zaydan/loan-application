function completeStep1() {
    cy.get('input[name="loanType"][value="personal"]').check({ force: true });
    cy.get('input[name="loanAmount"]').clear().type('300000');
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.contains('button', 'Next').click();
}

describe('Step 2 - Personal Information', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });

        completeStep1();
    });

    it('allows the user to complete Step 2 and move to Step 3', () => {
        cy.contains('Step 2').should('be.visible');
        cy.contains('Personal Information').should('be.visible');

        cy.get('input[name="fullName"]').type('Kareem Zaydan');
        cy.get('input[name="dateOfBirth"]').type('1998-01-01');

        cy.get('input[name="gender"][value="male"]').check({ force: true });
        cy.get('select[name="maritalStatus"]').select('single');

        cy.get('input[name="fatherName"]').type('Ahmad Zaydan');
        cy.get('input[name="motherName"]').type('Fatima Zaydan');

        cy.get('input[name="email"]').type('kareem@example.com');
        cy.get('input[name="mobileNumber"]').type('9876543210');

        cy.contains('button', 'Next').click();

        cy.contains('Step 3').should('be.visible');
        cy.contains('KYC Verification').should('be.visible');
    });

    it('shows validation errors for invalid Step 2 data', () => {
        cy.contains('button', 'Next').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    });
});