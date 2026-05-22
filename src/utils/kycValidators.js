export function normalizePAN(value = '') {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
}

export function normalizeDigits(value = '', maxLength = 12) {
    return value.replace(/\D/g, '').slice(0, maxLength);
}

export function validatePanNumber(panNumber, loanType = 'personal') {
    const pan = normalizePAN(panNumber);

    if (!pan) {
        return {
            isValid: false,
            message: 'PAN number is required.',
        };
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
        return {
            isValid: false,
            message: 'PAN must be 10 characters in format AAAAA9999A.',
        };
    }

    const entityType = pan[3];

    const allowedEntityTypes =
        loanType === 'business'
            ? ['P', 'C', 'F']
            : ['P'];

    if (!allowedEntityTypes.includes(entityType)) {
        return {
            isValid: false,
            message:
                loanType === 'business'
                    ? 'For business loans, PAN 4th character must be P, C, or F.'
                    : 'For personal/home loans, PAN 4th character must be P for Individual.',
        };
    }

    return {
        isValid: true,
        message: 'PAN format is valid.',
    };
}

const multiplicationTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const permutationTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function isValidAadhaarChecksum(aadhaarNumber) {
    const digits = normalizeDigits(aadhaarNumber, 12);

    if (!/^\d{12}$/.test(digits)) {
        return false;
    }

    let checksum = 0;
    const reversedDigits = digits.split('').reverse().map(Number);

    reversedDigits.forEach((digit, index) => {
        checksum = multiplicationTable[checksum][permutationTable[index % 8][digit]];
    });

    return checksum === 0;
}

export function validateAadhaarNumber(aadhaarNumber) {
    const aadhaar = normalizeDigits(aadhaarNumber, 12);

    if (!aadhaar) {
        return {
            isValid: false,
            message: 'Aadhaar number is required.',
        };
    }

    if (!/^\d{12}$/.test(aadhaar)) {
        return {
            isValid: false,
            message: 'Aadhaar must contain exactly 12 digits.',
        };
    }

    if (!isValidAadhaarChecksum(aadhaar)) {
        return {
            isValid: false,
            message: 'Aadhaar failed Verhoeff checksum validation.',
        };
    }

    return {
        isValid: true,
        message: 'Aadhaar checksum is valid.',
    };
}

export function validateVoterId(value = '') {
    if (!value) {
        return true;
    }

    return /^[A-Z]{3}[0-9]{7}$/.test(value.toUpperCase());
}

export function validatePassport(value = '') {
    if (!value) {
        return true;
    }

    return /^[A-Z][0-9]{7}$/.test(value.toUpperCase());
}