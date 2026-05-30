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

function completeStep4() {
    cy.get('input[name="currentAddressLine1"]').type('House 12, MG Road');
    cy.get('input[name="currentAddressLine2"]').type('Near Central Mall');
    cy.get('input[name="currentPinCode"]').type('110001');

    cy.contains('Found: Connaught Place, New Delhi, Delhi', {
        timeout: 3000,
    }).should('be.visible');

    cy.get('select[name="residenceType"]').select('owned');
    cy.get('input[name="yearsAtCurrentAddress"]').type('2');

    cy.contains('button', 'Next').click();
}

describe('Step 5 - Employment and Income', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });

        completeStep1();
        completeStep2();
        completeStep3();
        completeStep4();
    });

    it('allows a salaried applicant to complete Step 5 and move to Step 6', () => {
        cy.contains('Step 5').should('be.visible');
        cy.contains('Employment & Income').should('be.visible');

        cy.get('input[name="employmentType"][value="salaried"]').check({ force: true });

        cy.get('input[name="companyName"]').type('HDFC Bank');
        cy.get('input[name="designation"]').type('Software Engineer');
        cy.get('input[name="monthlyNetSalary"]').type('75000');
        cy.get('input[name="yearsOfExperience"]').type('3');

        cy.contains('button', 'Next').click();

        cy.contains('Step 6').should('be.visible');
        cy.contains('Co-applicant Details').should('be.visible');
    });

    it('shows validation errors when salaried applicant data is incomplete', () => {
        cy.get('input[name="employmentType"][value="salaried"]').check({ force: true });

        cy.contains('button', 'Next').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    });

    it('shows self-employed conditional fields and allows completion', () => {
        cy.get('input[name="employmentType"][value="self_employed"]').check({ force: true });

        cy.contains('Business / Self-Employment Details').should('be.visible');

        cy.get('input[name="businessName"]').type('Kareem Consulting');
        cy.get('select[name="businessType"]').select('freelancer');
        cy.get('input[name="annualTurnover"]').type('800000');
        cy.get('input[name="yearsInBusiness"]').type('3');
        cy.get('input[name="monthlyIncome"]').type('60000');

        cy.get('input[name="officeAddressLine1"]').type('Office 5, MG Road');
        cy.get('input[name="officeCity"]').type('Mumbai');
        cy.get('select[name="officeState"]').select('Maharashtra');
        cy.get('input[name="officePinCode"]').type('400001');

        cy.contains('button', 'Next').click();

        cy.contains('Step 6').should('be.visible');
        cy.contains('Co-applicant Details').should('be.visible');
    });
});