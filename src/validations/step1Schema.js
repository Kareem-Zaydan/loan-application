import { z } from 'zod';
import {
    LOAN_AMOUNT_LIMITS,
    LOAN_PURPOSE_OPTIONS,
    TENURE_LIMITS,
} from '../constants/loanOptions';

const requiredNumber = (fieldName) => z.preprocess(
    (value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    },
    z.number({
        required_error: `${fieldName} is required.`,
        invalid_type_error: `${fieldName} must be a valid number.`,
    }),
);

export const step1Schema = z
    .object({
        loanType: z.enum(['personal', 'home', 'business'], {
            required_error: 'Please select a loan type.',
            invalid_type_error: 'Please select a loan type.',
        }),
        loanAmount: requiredNumber('Loan amount'),
        tenureMonths: requiredNumber('Loan tenure'),
        loanPurpose: z.string().min(1, 'Please select a loan purpose.'),
        referralCode: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || /^[a-zA-Z0-9]{6,10}$/.test(value),
                'Referral code must be 6 to 10 alphanumeric characters.',
            ),
    })
    .superRefine((data, ctx) => {
        const amountLimits = LOAN_AMOUNT_LIMITS[data.loanType];
        const tenureLimits = TENURE_LIMITS[data.loanType];
        const validPurposeValues = LOAN_PURPOSE_OPTIONS[data.loanType]?.map(
            (purpose) => purpose.value,
        ) || [];

        if (amountLimits) {
            if (data.loanAmount < amountLimits.min) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['loanAmount'],
                    message: `Minimum loan amount is ${amountLimits.label}.`,
                });
            }

            if (data.loanAmount > amountLimits.max) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['loanAmount'],
                    message: `Maximum loan amount for this loan type is ${amountLimits.label}.`,
                });
            }
        }

        if (tenureLimits) {
            if (data.tenureMonths < tenureLimits.min || data.tenureMonths > tenureLimits.max) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['tenureMonths'],
                    message: `Loan tenure must be ${tenureLimits.label}.`,
                });
            }
        }

        if (data.loanPurpose && !validPurposeValues.includes(data.loanPurpose)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['loanPurpose'],
                message: 'Please select a valid purpose for the selected loan type.',
            });
        }
    });