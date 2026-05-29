import { z } from 'zod';

export const step8Schema = z.object({
    reviewConfirmed: z
        .boolean()
        .refine((value) => value === true, {
            message: 'Please confirm that you reviewed the application details.',
        }),

    finalConsent: z
        .boolean()
        .refine((value) => value === true, {
            message: 'Final consent is required before submitting the application.',
        }),
});