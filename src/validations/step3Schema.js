import { z } from 'zod';
import {
    validateAadhaarNumber,
    validatePanNumber,
    validatePassport,
    validateVoterId,
} from '../utils/kycValidators';

export function createStep3Schema({
    loanType = 'personal',
    requiresPassport = false,
} = {}) {
    return z
        .object({
            panNumber: z.string().min(1, 'PAN number is required.'),
            panVerified: z
                .boolean()
                .refine((value) => value === true, {
                    message: 'Please verify PAN before continuing.',
                }),
            aadhaarNumber: z.string().min(1, 'Aadhaar number is required.'),
            aadhaarVerified: z
                .boolean()
                .refine((value) => value === true, {
                    message: 'Please verify Aadhaar before continuing.',
                }),
            aadhaarConsent: z
                .boolean()
                .refine((value) => value === true, {
                    message: 'Aadhaar consent is required before verification.',
                }),
            voterId: z.string().trim().optional(),
            passportNumber: z.string().trim().optional(),
        })
        .superRefine((data, ctx) => {
            const panValidation = validatePanNumber(data.panNumber, loanType);

            if (!panValidation.isValid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['panNumber'],
                    message: panValidation.message,
                });
            }

            const aadhaarValidation = validateAadhaarNumber(data.aadhaarNumber);

            if (!aadhaarValidation.isValid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['aadhaarNumber'],
                    message: aadhaarValidation.message,
                });
            }

            if (data.voterId && !validateVoterId(data.voterId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['voterId'],
                    message: 'Voter ID must be 3 uppercase letters followed by 7 digits.',
                });
            }

            if (data.passportNumber && !validatePassport(data.passportNumber)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['passportNumber'],
                    message: 'Passport must be 1 uppercase letter followed by 7 digits.',
                });
            }

            if (requiresPassport && !data.passportNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['passportNumber'],
                    message: 'Passport is required for home loans above ₹50,00,000.',
                });
            }
        });
}