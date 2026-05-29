export function formatCurrency(value) {
    const numberValue = Number(value || 0);

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(numberValue);
}

export function formatReadableValue(value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value === null || value === undefined || value === '') return 'Not provided';

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function calculateEstimatedEmi(loanAmount, tenureMonths, annualRate = 11.5) {
    const principal = Number(loanAmount || 0);
    const tenure = Number(tenureMonths || 0);
    const monthlyRate = annualRate / 12 / 100;

    if (!principal || !tenure || !monthlyRate) {
        return 0;
    }

    const emi =
        (principal * monthlyRate * ((1 + monthlyRate) ** tenure))
        / (((1 + monthlyRate) ** tenure) - 1);

    return Math.round(emi);
}

export function getPrimaryMonthlyIncome(step5 = {}) {
    if (step5.employmentType === 'salaried') {
        return Number(step5.monthlyNetSalary || 0);
    }

    if (step5.employmentType === 'self_employed') {
        return Number(step5.monthlyIncome || 0);
    }

    if (step5.employmentType === 'business_owner') {
        return Math.round(Number(step5.annualTurnover || 0) / 12);
    }

    return 0;
}

export function getCoApplicantMonthlyIncome(step6 = {}) {
    if (!step6.addCoApplicant) {
        return 0;
    }

    return Number(step6.coApplicantMonthlyIncome || 0);
}

export function calculatePreApproval(applicationData = {}) {
    const step1 = applicationData.step1 || {};
    const step5 = applicationData.step5 || {};
    const step6 = applicationData.step6 || {};
    const step7 = applicationData.step7 || {};

    const loanAmount = Number(step1.loanAmount || 0);
    const tenureMonths = Number(step1.tenureMonths || step1.tenure || 0);

    const primaryIncome = getPrimaryMonthlyIncome(step5);
    const coApplicantIncome = getCoApplicantMonthlyIncome(step6);
    const totalMonthlyIncome = primaryIncome + coApplicantIncome;

    const estimatedEmi = calculateEstimatedEmi(loanAmount, tenureMonths);
    const emiToIncomeRatio = totalMonthlyIncome
        ? Math.round((estimatedEmi / totalMonthlyIncome) * 100)
        : 0;

    let score = 50;

    if (totalMonthlyIncome >= 100000) score += 20;
    else if (totalMonthlyIncome >= 50000) score += 12;
    else if (totalMonthlyIncome >= 25000) score += 6;

    if (emiToIncomeRatio > 0 && emiToIncomeRatio <= 35) score += 20;
    else if (emiToIncomeRatio <= 50) score += 10;
    else score -= 15;

    if (step6.addCoApplicant) score += 8;

    if (
        step7.identityProof?.length
        && step7.addressProof?.length
        && step7.incomeProof?.length
        && step7.bankStatement?.length
        && step7.signatureDataUrl
    ) {
        score += 12;
    }

    score = Math.max(0, Math.min(score, 100));

    let status = 'Needs Review';
    let message = 'Your application needs manual review by the loan team.';

    if (score >= 80) {
        status = 'Pre-approved';
        message = 'Your application looks strong and is eligible for pre-approval.';
    } else if (score >= 60) {
        status = 'Conditionally Eligible';
        message = 'Your application may be approved after additional checks.';
    }

    return {
        score,
        status,
        message,
        estimatedEmi,
        emiToIncomeRatio,
        primaryIncome,
        coApplicantIncome,
        totalMonthlyIncome,
    };
}