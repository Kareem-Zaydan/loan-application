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

function completeStep3() {
    cy.get('input[name="panNumber"]').type('AAAPA9999A');
    cy.contains('button', 'Verify PAN').click();

    cy.get('input[name="aadhaarNumber"]').type('999999990019');
    cy.contains('button', 'Verify Aadhaar').click();

    cy.wait(1800);

    cy.get('input[name="aadhaarConsent"]').check({ force: true });
    cy.contains('button', 'Next').click();
}

describe('Step 4 - Address Information', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });

        completeStep1();
        completeStep2();
        completeStep3();
    });

    it('auto-fills city, state, and post office from PIN code', () => {
        cy.contains('Step 4').should('be.visible');
        cy.contains('Address Information').should('be.visible');

        cy.get('input[name="currentAddressLine1"]').type('House 12, MG Road');
        cy.get('input[name="currentAddressLine2"]').type('Near Central Mall');
        cy.get('input[name="currentPinCode"]').type('110001');

        cy.contains('Found: Connaught Place, New Delhi, Delhi', {
            timeout: 3000,
        }).should('be.visible');

        cy.get('input[name="currentCity"]').should('have.value', 'New Delhi');
        cy.get('select[name="currentState"]').should('have.value', 'Delhi');
        cy.get('input[name="currentPostOffice"]').should('have.value', 'Connaught Place');
    });

    it('allows the user to complete Step 4 and move to Step 5', () => {
        cy.get('input[name="currentAddressLine1"]').type('House 12, MG Road');
        cy.get('input[name="currentAddressLine2"]').type('Near Central Mall');
        cy.get('input[name="currentPinCode"]').type('110001');

        cy.contains('Found: Connaught Place, New Delhi, Delhi', {
            timeout: 3000,
        }).should('be.visible');

        cy.get('select[name="residenceType"]').select('owned');
        cy.get('input[name="yearsAtCurrentAddress"]').type('2');

        cy.get('input[name="sameAsPermanentAddress"]').should('be.checked');

        cy.contains('button', 'Next').click();

        cy.contains('Step 5').should('be.visible');
        cy.contains('Employment & Income').should('be.visible');
    });
});