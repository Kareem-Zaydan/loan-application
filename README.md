# LendSwift — Multi-Step Loan Application Form

A production-style multi-step loan application form built with React, Vite, Tailwind CSS, React Hook Form, Zod validation, document upload, e-signature capture, encrypted auto-save, resume draft flow, and Cypress E2E test coverage.

This project was built as part of the Zetheta WorkBridge Front End Developer assignment.

---

## Project Overview

LendSwift is an 8-step loan application wizard that guides users through the complete loan application process.

The application supports:

- Personal Loan
- Home Loan
- Business Loan

Each loan type has conditional validation and dynamic fields depending on the selected options.

---

## Main Features

### 1. Multi-Step Wizard

The form contains 8 steps:

1. Loan Type & Loan Details
2. Personal Information
3. KYC Verification
4. Address Information
5. Employment & Income
6. Co-applicant Details
7. Documents & E-signature
8. Review & Submit

---

### 2. Real-Time Validation

Validation is handled using:

- React Hook Form
- Zod
- Custom cross-step validation rules

Examples:

- Loan amount and tenure validation based on loan type
- PAN format validation
- Aadhaar validation simulation
- Address PIN lookup validation
- Business Loan cannot use Salaried employment type
- Co-applicant fields become required only when co-applicant is selected
- Required document upload validation
- Final review confirmation before submit

---

### 3. Conditional Fields

The form dynamically shows fields based on user choices.

Examples:

- Business Loan shows business-related purposes
- Home Loan above a threshold requires passport
- Rented residence shows rent amount
- Less than 1 year at current address requires previous address
- Self-employed and business owner applicants show business fields
- Co-applicant fields appear only when selected
- Homemaker co-applicant does not require monthly income

---

### 4. KYC Verification Simulation

The KYC step includes simulated verification for:

- PAN
- Aadhaar
- Voter ID
- Passport

The verification flow includes loading states, success states, failed states, and consent validation.

---

### 5. Address PIN Code Lookup

The address step includes a simulated India PIN code lookup system.

When a valid PIN code is entered, the app auto-fills:

- City
- State
- Post Office

Example:

```txt
PIN: 110001
City: New Delhi
State: Delhi
Post Office: Connaught Place