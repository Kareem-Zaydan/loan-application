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

function completeStep5() {
    cy.get('input[name="employmentType"][value="salaried"]').check({ force: true });

    cy.get('input[name="companyName"]').type('HDFC Bank');
    cy.get('input[name="designation"]').type('Software Engineer');
    cy.get('input[name="monthlyNetSalary"]').type('75000');
    cy.get('input[name="yearsOfExperience"]').type('3');

    cy.contains('button', 'Next').click();
}

describe('Step 6 - Co-applicant Details', () => {
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
        completeStep5();
    });

    it('allows the user to continue without a co-applicant', () => {
        cy.contains('Step 6').should('be.visible');
        cy.contains('Co-applicant Details').should('be.visible');

        cy.get('input[name="addCoApplicant"]').should('not.be.checked');

        cy.contains('button', 'Next').click();

        cy.contains('Step 7').should('be.visible');
        cy.contains('Documents & E-signature').should('be.visible');
    });

    it('allows the user to add a co-applicant and move to Step 7', () => {
        cy.get('input[name="addCoApplicant"]').check({ force: true });

        cy.get('input[name="coApplicantFullName"]').type('Ahmad Zaydan');
        cy.get('select[name="coApplicantRelationship"]').select('father');
        cy.get('input[name="coApplicantDateOfBirth"]').type('1970-01-01');
        cy.get('input[name="coApplicantMobile"]').type('9876543210');
        cy.get('input[name="coApplicantEmail"]').type('ahmad@example.com');

        cy.get('input[name="coApplicantPAN"]').type('AAAPA9999A');
        cy.get('input[name="coApplicantAadhaar"]').type('999999990019');

        cy.get('select[name="coApplicantEmploymentType"]').select('retired');
        cy.get('select[name="coApplicantIncomeSource"]').select('pension');
        cy.get('input[name="coApplicantMonthlyIncome"]').type('30000');

        cy.get('input[name="coApplicantConsent"]').check({ force: true });

        cy.contains('button', 'Next').click();

        cy.contains('Step 7').should('be.visible');
        cy.contains('Documents & E-signature').should('be.visible');
    });

    it('shows validation errors when co-applicant is checked but details are missing', () => {
        cy.get('input[name="addCoApplicant"]').check({ force: true });

        cy.contains('button', 'Next').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    });
});