import { z } from 'zod';

const pinCodeRegex = /^\d{6}$/;

const addressLineRequired = (fieldName) => z
    .string()
    .trim()
    .min(5, `${fieldName} must be at least 5 characters.`)
    .max(200, `${fieldName} must not exceed 200 characters.`);

const optionalAddressLine = z
    .string()
    .trim()
    .max(200, 'Address line must not exceed 200 characters.')
    .optional();

const pinCodeField = (fieldName) => z
    .string()
    .trim()
    .regex(pinCodeRegex, `${fieldName} must be exactly 6 digits.`);

const cityOrStateField = (fieldName) => z
    .string()
    .trim()
    .min(2, `${fieldName} is required.`);

export const step4Schema = z
    .object({
        currentAddressLine1: addressLineRequired('Current address line 1'),
        currentAddressLine2: optionalAddressLine,
        currentPinCode: pinCodeField('Current PIN code'),
        currentCity: cityOrStateField('Current city'),
        currentState: cityOrStateField('Current state'),
        currentPostOffice: cityOrStateField('Current post office'),

        residenceType: z
            .string()
            .min(1, 'Please select residence type.'),

        rentAmount: z.preprocess(
            (value) => {
                if (value === '' || value === null || value === undefined) {
                    return undefined;
                }

                return Number(value);
            },
            z.number().positive('Rent amount must be greater than zero.').optional(),
        ),

        yearsAtCurrentAddress: z.preprocess(
            (value) => {
                if (value === '' || value === null || value === undefined) {
                    return undefined;
                }

                return Number(value);
            },
            z
                .number({
                    required_error: 'Years at current address is required.',
                    invalid_type_error: 'Years at current address must be a valid number.',
                })
                .min(0, 'Years at current address cannot be negative.')
                .max(50, 'Years at current address cannot exceed 50.'),
        ),

        previousAddressLine1: z.string().trim().optional(),
        previousPinCode: z.string().trim().optional(),
        previousCity: z.string().trim().optional(),
        previousState: z.string().trim().optional(),

        sameAsPermanentAddress: z.boolean(),

        permanentAddressLine1: z.string().trim().optional(),
        permanentAddressLine2: z.string().trim().optional(),
        permanentPinCode: z.string().trim().optional(),
        permanentCity: z.string().trim().optional(),
        permanentState: z.string().trim().optional(),
        permanentPostOffice: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.residenceType === 'rented' && !data.rentAmount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['rentAmount'],
                message: 'Rent amount is required when residence type is rented.',
            });
        }

        if (Number(data.yearsAtCurrentAddress) < 1) {
            if (!data.previousAddressLine1 || data.previousAddressLine1.length < 5) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['previousAddressLine1'],
                    message: 'Previous address is required if current stay is less than 1 year.',
                });
            }

            if (!pinCodeRegex.test(data.previousPinCode || '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['previousPinCode'],
                    message: 'Previous address PIN code must be exactly 6 digits.',
                });
            }

            if (!data.previousCity) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['previousCity'],
                    message: 'Previous city is required.',
                });
            }

            if (!data.previousState) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['previousState'],
                    message: 'Previous state is required.',
                });
            }
        }

        if (!data.sameAsPermanentAddress) {
            if (!data.permanentAddressLine1 || data.permanentAddressLine1.length < 5) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['permanentAddressLine1'],
                    message: 'Permanent address line 1 is required.',
                });
            }

            if (!pinCodeRegex.test(data.permanentPinCode || '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['permanentPinCode'],
                    message: 'Permanent PIN code must be exactly 6 digits.',
                });
            }

            if (!data.permanentCity) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['permanentCity'],
                    message: 'Permanent city is required.',
                });
            }

            if (!data.permanentState) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['permanentState'],
                    message: 'Permanent state is required.',
                });
            }

            if (!data.permanentPostOffice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['permanentPostOffice'],
                    message: 'Permanent post office is required.',
                });
            }
        }
    });