import { z } from 'zod';

const documentRecordSchema = z.object({
    id: z.string(),
    name: z.string(),
    originalName: z.string(),
    type: z.string(),
    size: z.number(),
    originalSize: z.number(),
    compressionSavedBytes: z.number(),
    previewUrl: z.string(),
    uploadedAt: z.string(),
});

export const step7Schema = z
    .object({
        identityProof: z.array(documentRecordSchema),
        addressProof: z.array(documentRecordSchema),
        incomeProof: z.array(documentRecordSchema),
        bankStatement: z.array(documentRecordSchema),
        signatureDataUrl: z.string().optional(),
        documentConsent: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.identityProof.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['identityProof'],
                message: 'Identity proof document is required.',
            });
        }

        if (data.addressProof.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['addressProof'],
                message: 'Address proof document is required.',
            });
        }

        if (data.incomeProof.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['incomeProof'],
                message: 'Income proof document is required.',
            });
        }

        if (data.bankStatement.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['bankStatement'],
                message: 'Bank statement document is required.',
            });
        }

        if (!data.signatureDataUrl) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['signatureDataUrl'],
                message: 'E-signature is required.',
            });
        }

        if (!data.documentConsent) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['documentConsent'],
                message: 'Please confirm the document declaration.',
            });
        }
    });