export const LOAN_TYPES = [
    {
        value: 'personal',
        label: 'Personal Loan',
        description: 'For medical expenses, travel, education, weddings, or personal needs.',
    },
    {
        value: 'home',
        label: 'Home Loan',
        description: 'For buying, constructing, or renovating residential property.',
    },
    {
        value: 'business',
        label: 'Business Loan',
        description: 'For working capital, expansion, equipment, or business operations.',
    },
];

export const LOAN_AMOUNT_LIMITS = {
    personal: {
        min: 50000,
        max: 1000000,
        label: '₹50,000 to ₹10,00,000',
    },
    home: {
        min: 50000,
        max: 10000000,
        label: '₹50,000 to ₹1,00,00,000',
    },
    business: {
        min: 50000,
        max: 5000000,
        label: '₹50,000 to ₹50,00,000',
    },
};

export const TENURE_LIMITS = {
    personal: {
        min: 12,
        max: 60,
        label: '12 to 60 months',
    },
    home: {
        min: 60,
        max: 360,
        label: '60 to 360 months',
    },
    business: {
        min: 12,
        max: 120,
        label: '12 to 120 months',
    },
};

export const TENURE_OPTIONS = {
    personal: [
        { value: '12', label: '12 months' },
        { value: '24', label: '24 months' },
        { value: '36', label: '36 months' },
        { value: '48', label: '48 months' },
        { value: '60', label: '60 months' },
    ],
    home: [
        { value: '60', label: '60 months / 5 years' },
        { value: '120', label: '120 months / 10 years' },
        { value: '180', label: '180 months / 15 years' },
        { value: '240', label: '240 months / 20 years' },
        { value: '300', label: '300 months / 25 years' },
        { value: '360', label: '360 months / 30 years' },
    ],
    business: [
        { value: '12', label: '12 months' },
        { value: '24', label: '24 months' },
        { value: '36', label: '36 months' },
        { value: '60', label: '60 months' },
        { value: '84', label: '84 months' },
        { value: '120', label: '120 months' },
    ],
};

export const LOAN_PURPOSE_OPTIONS = {
    personal: [
        { value: 'medical', label: 'Medical Expenses' },
        { value: 'education', label: 'Education' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'travel', label: 'Travel' },
        { value: 'debt_consolidation', label: 'Debt Consolidation' },
        { value: 'other_personal', label: 'Other Personal Need' },
    ],
    home: [
        { value: 'home_purchase', label: 'Home Purchase' },
        { value: 'home_construction', label: 'Home Construction' },
        { value: 'home_renovation', label: 'Home Renovation' },
        { value: 'plot_purchase', label: 'Plot Purchase' },
        { value: 'balance_transfer', label: 'Balance Transfer' },
    ],
    business: [
        { value: 'working_capital', label: 'Working Capital' },
        { value: 'business_expansion', label: 'Business Expansion' },
        { value: 'equipment_purchase', label: 'Equipment Purchase' },
        { value: 'inventory_purchase', label: 'Inventory Purchase' },
        { value: 'marketing', label: 'Marketing / Growth' },
    ],
};

export function getLoanTypeLabel(loanType) {
    return LOAN_TYPES.find((type) => type.value === loanType)?.label || 'Selected loan';
}