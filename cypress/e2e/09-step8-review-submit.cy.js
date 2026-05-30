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

function completeStep6WithoutCoApplicant() {
    cy.get('input[name="addCoApplicant"]').should('not.be.checked');
    cy.contains('button', 'Next').click();
}

function drawSignature() {
    cy.get('canvas[aria-label="Signature canvas"]')
        .scrollIntoView()
        .then(($canvas) => {
            const rect = $canvas[0].getBoundingClientRect();

            const startX = rect.left + 100;
            const startY = rect.top + 80;
            const midX = rect.left + 220;
            const midY = rect.top + 110;
            const endX = rect.left + 340;
            const endY = rect.top + 75;

            cy.wrap($canvas)
                .trigger('mousedown', {
                    eventConstructor: 'MouseEvent',
                    button: 0,
                    buttons: 1,
                    which: 1,
                    clientX: startX,
                    clientY: startY,
                    force: true,
                })
                .trigger('mousemove', {
                    eventConstructor: 'MouseEvent',
                    button: 0,
                    buttons: 1,
                    which: 1,
                    clientX: midX,
                    clientY: midY,
                    force: true,
                })
                .trigger('mousemove', {
                    eventConstructor: 'MouseEvent',
                    button: 0,
                    buttons: 1,
                    which: 1,
                    clientX: endX,
                    clientY: endY,
                    force: true,
                });

            cy.document().trigger('mouseup', {
                eventConstructor: 'MouseEvent',
                button: 0,
                buttons: 0,
                which: 1,
                clientX: endX,
                clientY: endY,
                force: true,
            });
        });
}

function completeStep7() {
    cy.get('input[type="file"]')
        .first()
        .selectFile('cypress/fixtures/identity-test.pdf', { force: true });

    cy.get('input[type="file"]')
        .first()
        .selectFile('cypress/fixtures/address-test.pdf', { force: true });

    cy.get('input[type="file"]')
        .first()
        .selectFile('cypress/fixtures/income-test.pdf', { force: true });

    cy.get('input[type="file"]')
        .first()
        .selectFile('cypress/fixtures/bank-test.pdf', { force: true });

    drawSignature();

    cy.contains('Signature captured', { timeout: 5000 }).should('be.visible');

    cy.get('input[name="documentConsent"]').check({ force: true });

    cy.contains('button', 'Next').click();
}

function completeStepsUntilReview() {
    completeStep1();
    completeStep2();
    completeStep3();
    completeStep4();
    completeStep5();
    completeStep6WithoutCoApplicant();
    completeStep7();
}

describe('Step 8 - Review and Submit', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.clear();
            },
        });

        completeStepsUntilReview();
    });

    it('shows the review summary and pre-approval result', () => {
        cy.contains('Step 8').should('be.visible');
        cy.contains('Review & Submit').should('be.visible');

        cy.contains('Pre-approval result').should('be.visible');
        cy.contains('Eligibility Score').should('be.visible');
        cy.contains('Estimated EMI').should('be.visible');

        cy.contains('Loan Details').should('be.visible');
        cy.contains('Applicant Details').should('be.visible');
        cy.contains('KYC Status').should('be.visible');
        cy.contains('Uploaded Documents').should('be.visible');

        cy.contains('Kareem Zaydan').should('be.visible');
        cy.contains('HDFC Bank').should('be.visible');
        cy.contains('identity-test.pdf').should('be.visible');
    });

    it('requires final confirmations before submitting', () => {
        cy.contains('button', 'Submit Application').click();

        cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    });

    it('submits the application after final confirmations are checked', () => {
        cy.get('input[name="reviewConfirmed"]').check({ force: true });
        cy.get('input[name="finalConsent"]').check({ force: true });

        cy.contains('button', 'Submit Application').click();

        cy.contains('Application Submitted Successfully').should('be.visible');
        cy.contains('Demo Application ID').should('be.visible');
    });
});