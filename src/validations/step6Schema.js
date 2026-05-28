import { z } from 'zod';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const mobileRegex = /^[6-9]\d{9}$/;
const aadhaarRegex = /^\d{12}$/;

const optionalText = z.string().trim().optional();

const optionalNumber = z.preprocess(
    (value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    },
    z.number().optional(),
);

export const step6Schema = z
    .object({
        addCoApplicant: z.boolean(),

        coApplicantFullName: optionalText,
        coApplicantRelationship: optionalText,
        coApplicantDateOfBirth: optionalText,
        coApplicantMobile: optionalText,
        coApplicantEmail: optionalText,

        coApplicantPAN: optionalText,
        coApplicantAadhaar: optionalText,

        coApplicantEmploymentType: optionalText,
        coApplicantIncomeSource: optionalText,
        coApplicantMonthlyIncome: optionalNumber,

        coApplicantConsent: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.addCoApplicant) {
            return;
        }

        if (!data.coApplicantFullName || data.coApplicantFullName.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantFullName'],
                message: 'Co-applicant full name must be at least 3 characters.',
            });
        }

        if (!data.coApplicantRelationship) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantRelationship'],
                message: 'Please select co-applicant relationship.',
            });
        }

        if (!data.coApplicantDateOfBirth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantDateOfBirth'],
                message: 'Co-applicant date of birth is required.',
            });
        } else {
            const birthDate = new Date(data.coApplicantDateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const hasBirthdayPassed =
                today.getMonth() > birthDate.getMonth()
                || (
                    today.getMonth() === birthDate.getMonth()
                    && today.getDate() >= birthDate.getDate()
                );

            const finalAge = hasBirthdayPassed ? age : age - 1;

            if (Number.isNaN(birthDate.getTime())) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['coApplicantDateOfBirth'],
                    message: 'Please enter a valid date of birth.',
                });
            }

            if (finalAge < 21) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['coApplicantDateOfBirth'],
                    message: 'Co-applicant must be at least 21 years old.',
                });
            }

            if (finalAge > 70) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['coApplicantDateOfBirth'],
                    message: 'Co-applicant age cannot exceed 70 years.',
                });
            }
        }

        if (!mobileRegex.test(data.coApplicantMobile || '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantMobile'],
                message: 'Co-applicant mobile number must be a valid 10-digit Indian mobile number.',
            });
        }

        if (
            data.coApplicantEmail
            && !z.string().email().safeParse(data.coApplicantEmail).success
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantEmail'],
                message: 'Please enter a valid email address.',
            });
        }

        if (!panRegex.test((data.coApplicantPAN || '').toUpperCase())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantPAN'],
                message: 'Co-applicant PAN must be valid. Example: AAAPA9999A.',
            });
        }

        if (!aadhaarRegex.test(data.coApplicantAadhaar || '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantAadhaar'],
                message: 'Co-applicant Aadhaar must be exactly 12 digits.',
            });
        }

        if (!data.coApplicantEmploymentType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantEmploymentType'],
                message: 'Please select co-applicant employment type.',
            });
        }

        if (!data.coApplicantIncomeSource) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantIncomeSource'],
                message: 'Please select co-applicant income source.',
            });
        }

        if (
            data.coApplicantEmploymentType !== 'homemaker'
            && (!data.coApplicantMonthlyIncome || data.coApplicantMonthlyIncome < 10000)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantMonthlyIncome'],
                message: 'Co-applicant monthly income must be at least ₹10,000.',
            });
        }

        if (!data.coApplicantConsent) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['coApplicantConsent'],
                message: 'Consent is required to add a co-applicant.',
            });
        }
    });