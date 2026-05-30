function completeStep1() {
    cy.get('input[name="loanType"][value="personal"]').check({ force: true });
    cy.get('input[name="loanAmount"]').clear().type('300000');
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.contains('button', 'Next').click();
}

function completeStep2() {
    cy.get('input[name="fullName"]').type('Kareem Zaydan');
    cy.get('input[name="dateOfBirth"]').type('1998-01-01');
    cy.get('input[name="gender"][value="male"]').check({ force: true });
    cy.get('select[name="maritalStatus"]').select('single');
    cy.get('input[name="fatherName"]').type('Ahmad Zaydan');
    cy.get('input[name="motherName"]').type('Fatima Zaydan');
    cy.get('input[name="email"]').type('kareem@example.com');
    cy.get('input[name="mobileNumber"]').type('9876543210');
    cy.contains('button', 'Next').click();
}

describe('Step 3 - KYC Verification', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });

        completeStep1();
        completeStep2();
    });

    it('allows the user to verify PAN and Aadhaar then move to Step 4', () => {
        cy.contains('Step 3').should('be.visible');
        cy.contains('KYC Verification').should('be.visible');

        cy.get('input[name="panNumber"]').type('AAAPA9999A');
        cy.contains('button', 'Verify PAN').click();

        cy.get('input[name="aadhaarNumber"]').type('999999990019');
        cy.contains('button', 'Verify Aadhaar').click();

        cy.wait(1800);

        cy.get('input[name="aadhaarConsent"]').check({ force: true });

        cy.contains('button', 'Next').click();

        cy.contains('Step 4').should('be.visible');
        cy.contains('Address Information').should('be.visible');
    });

    it('shows validation errors when KYC is not verified', () => {
        cy.contains('button', 'Next').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    });
});