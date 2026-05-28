import { z } from 'zod';

const optionalText = z.string().trim().optional();

const requiredNumber = (fieldName, schema) => z.preprocess(
    (value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    },
    schema || z.number({
        required_error: `${fieldName} is required.`,
        invalid_type_error: `${fieldName} must be a valid number.`,
    }),
);

const optionalNumber = z.preprocess(
    (value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    },
    z.number().optional(),
);

const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function createStep5Schema({ loanType = 'personal' } = {}) {
    return z
        .object({
            employmentType: z.enum(
                ['salaried', 'self_employed', 'business_owner'],
                {
                    required_error: 'Please select employment type.',
                    invalid_type_error: 'Please select employment type.',
                },
            ),

            companyName: optionalText,
            designation: optionalText,
            monthlyNetSalary: optionalNumber,

            yearsOfExperience: requiredNumber(
                'Years of experience',
                z
                    .number({
                        required_error: 'Years of experience is required.',
                        invalid_type_error: 'Years of experience must be a valid number.',
                    })
                    .min(0, 'Years of experience cannot be negative.')
                    .max(50, 'Years of experience cannot exceed 50.'),
            ),

            businessName: optionalText,
            businessType: optionalText,
            annualTurnover: optionalNumber,
            yearsInBusiness: optionalNumber,
            monthlyIncome: optionalNumber,
            gstNumber: optionalText,

            officeAddressLine1: optionalText,
            officeCity: optionalText,
            officeState: optionalText,
            officePinCode: optionalText,
        })
        .superRefine((data, ctx) => {
            if (
                loanType === 'business'
                && data.employmentType === 'salaried'
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['employmentType'],
                    message: 'Business loan requires Self-Employed or Business Owner employment type.',
                });
            }

            if (data.employmentType === 'salaried') {
                if (!data.companyName || data.companyName.length < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['companyName'],
                        message: 'Company name is required for salaried applicants.',
                    });
                }

                if (!data.designation || data.designation.length < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['designation'],
                        message: 'Designation is required for salaried applicants.',
                    });
                }

                if (!data.monthlyNetSalary || data.monthlyNetSalary < 15000) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['monthlyNetSalary'],
                        message: 'Monthly net salary must be at least ₹15,000.',
                    });
                }
            }

            if (
                data.employmentType === 'self_employed'
                || data.employmentType === 'business_owner'
            ) {
                if (!data.businessName || data.businessName.length < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['businessName'],
                        message: 'Business name is required.',
                    });
                }

                if (!data.businessType) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['businessType'],
                        message: 'Business type is required.',
                    });
                }

                if (!data.annualTurnover || data.annualTurnover < 300000) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['annualTurnover'],
                        message: 'Annual turnover must be at least ₹3,00,000.',
                    });
                }

                if (!data.yearsInBusiness || data.yearsInBusiness < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['yearsInBusiness'],
                        message: 'Years in business must be at least 2.',
                    });
                }

                if (!data.officeAddressLine1 || data.officeAddressLine1.length < 5) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['officeAddressLine1'],
                        message: 'Office/business address is required.',
                    });
                }

                if (!data.officeCity) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['officeCity'],
                        message: 'Office city is required.',
                    });
                }

                if (!data.officeState) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['officeState'],
                        message: 'Office state is required.',
                    });
                }

                if (!/^\d{6}$/.test(data.officePinCode || '')) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['officePinCode'],
                        message: 'Office PIN code must be exactly 6 digits.',
                    });
                }
            }

            if (data.employmentType === 'self_employed') {
                if (!data.monthlyIncome || data.monthlyIncome < 15000) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['monthlyIncome'],
                        message: 'Monthly income must be at least ₹15,000.',
                    });
                }
            }

            if (data.employmentType === 'business_owner') {
                if (!data.gstNumber || !gstRegex.test(data.gstNumber.toUpperCase())) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['gstNumber'],
                        message: 'GST number must be a valid 15-character GSTIN.',
                    });
                }
            }
        });
}