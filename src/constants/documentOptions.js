export const DOCUMENT_REQUIREMENTS = [
    {
        key: 'identityProof',
        title: 'Identity Proof',
        description: 'Upload PAN card, passport, voter ID, or driving license.',
        required: true,
    },
    {
        key: 'addressProof',
        title: 'Address Proof',
        description: 'Upload Aadhaar, utility bill, rent agreement, or bank statement.',
        required: true,
    },
    {
        key: 'incomeProof',
        title: 'Income Proof',
        description: 'Upload salary slip, ITR, Form 16, or business income proof.',
        required: true,
    },
    {
        key: 'bankStatement',
        title: 'Bank Statement',
        description: 'Upload last 6 months bank statement.',
        required: true,
    },
];

export const ACCEPTED_DOCUMENT_TYPES = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
};

export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;

export const SIGNATURE_DECLARATION =
    'I confirm that all information and documents provided in this loan application are true and accurate to the best of my knowledge.';