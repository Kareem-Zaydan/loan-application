import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Checkbox,
    ErrorMessage,
} from '../common';
import { step8Schema } from '../../validations/step8Schema';
import {
    calculatePreApproval,
    formatCurrency,
    formatReadableValue,
} from '../../utils/loanDecision';

const defaultStep8Values = {
    reviewConfirmed: false,
    finalConsent: false,
};

function SummaryCard({ title, children }) {
    return (
        <section className="rounded-xl border border-slate-200 p-4">
            <h4 className="mb-4 font-bold text-slate-900">
                {title}
            </h4>

            <div className="space-y-3">
                {children}
            </div>
        </section>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-b-0 sm:flex-row sm:justify-between">
            <span className="text-sm font-semibold text-slate-500">
                {label}
            </span>

            <span className="text-sm font-bold text-slate-900">
                {value}
            </span>
        </div>
    );
}

function DocumentSummary({ title, documents = [] }) {
    const document = documents[0];

    return (
        <SummaryRow
            label={title}
            value={document ? document.name : 'Missing'}
        />
    );
}

function Step8ReviewSubmit({
    formId,
    defaultValues = {},
    applicationData = {},
    onSubmit,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step8Schema),
        defaultValues: {
            ...defaultStep8Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const decision = useMemo(
        () => calculatePreApproval(applicationData),
        [applicationData],
    );

    const step1 = applicationData.step1 || {};
    const step2 = applicationData.step2 || {};
    const step3 = applicationData.step3 || {};
    const step4 = applicationData.step4 || {};
    const step5 = applicationData.step5 || {};
    const step6 = applicationData.step6 || {};
    const step7 = applicationData.step7 || {};

    const submitApplication = (values) => {
        onSubmit({
            ...values,
            decision,
            submittedAt: new Date().toISOString(),
        });
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(submitApplication)}
            className="space-y-6"
            noValidate
        >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-bold text-slate-900">
                    Review & Submit
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Review the full application summary, check the estimated eligibility
                    result, and submit the application.
                </p>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                            Pre-approval result
                        </p>

                        <h4 className="mt-1 text-2xl font-bold text-slate-900">
                            {decision.status}
                        </h4>

                        <p className="mt-2 text-sm text-slate-600">
                            {decision.message}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Eligibility Score
                        </p>

                        <p className="text-4xl font-bold text-accent">
                            {decision.score}
                        </p>

                        <p className="text-xs font-semibold text-slate-400">
                            out of 100
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-4">
                        <p className="text-sm text-slate-500">Estimated EMI</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {formatCurrency(decision.estimatedEmi)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                        <p className="text-sm text-slate-500">Total Monthly Income</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {formatCurrency(decision.totalMonthlyIncome)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                        <p className="text-sm text-slate-500">EMI / Income Ratio</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {decision.emiToIncomeRatio}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <SummaryCard title="Loan Details">
                    <SummaryRow
                        label="Loan Type"
                        value={formatReadableValue(step1.loanType)}
                    />

                    <SummaryRow
                        label="Loan Amount"
                        value={formatCurrency(step1.loanAmount)}
                    />

                    <SummaryRow
                        label="Tenure"
                        value={`${step1.tenureMonths || step1.tenure || 'Not provided'} months`}
                    />

                    <SummaryRow
                        label="Purpose"
                        value={formatReadableValue(step1.loanPurpose)}
                    />
                </SummaryCard>

                <SummaryCard title="Applicant Details">
                    <SummaryRow
                        label="Full Name"
                        value={formatReadableValue(step2.fullName)}
                    />

                    <SummaryRow
                        label="Date of Birth"
                        value={formatReadableValue(step2.dateOfBirth)}
                    />

                    <SummaryRow
                        label="Email"
                        value={formatReadableValue(step2.email)}
                    />

                    <SummaryRow
                        label="Mobile"
                        value={formatReadableValue(step2.mobileNumber)}
                    />
                </SummaryCard>

                <SummaryCard title="KYC Status">
                    <SummaryRow
                        label="PAN"
                        value={formatReadableValue(step3.panNumber)}
                    />

                    <SummaryRow
                        label="PAN Verified"
                        value={formatReadableValue(step3.panVerified)}
                    />

                    <SummaryRow
                        label="Aadhaar Verified"
                        value={formatReadableValue(step3.aadhaarVerified)}
                    />

                    <SummaryRow
                        label="Aadhaar Consent"
                        value={formatReadableValue(step3.aadhaarConsent)}
                    />
                </SummaryCard>

                <SummaryCard title="Address Details">
                    <SummaryRow
                        label="Current Address"
                        value={formatReadableValue(step4.currentAddressLine1)}
                    />

                    <SummaryRow
                        label="City"
                        value={formatReadableValue(step4.currentCity)}
                    />

                    <SummaryRow
                        label="State"
                        value={formatReadableValue(step4.currentState)}
                    />

                    <SummaryRow
                        label="PIN Code"
                        value={formatReadableValue(step4.currentPinCode)}
                    />
                </SummaryCard>

                <SummaryCard title="Employment & Income">
                    <SummaryRow
                        label="Employment Type"
                        value={formatReadableValue(step5.employmentType)}
                    />

                    <SummaryRow
                        label="Company / Business"
                        value={
                            formatReadableValue(
                                step5.companyName || step5.businessName,
                            )
                        }
                    />

                    <SummaryRow
                        label="Primary Monthly Income"
                        value={formatCurrency(decision.primaryIncome)}
                    />

                    <SummaryRow
                        label="Co-applicant Income"
                        value={formatCurrency(decision.coApplicantIncome)}
                    />
                </SummaryCard>

                <SummaryCard title="Co-applicant">
                    <SummaryRow
                        label="Added"
                        value={formatReadableValue(step6.addCoApplicant)}
                    />

                    <SummaryRow
                        label="Name"
                        value={formatReadableValue(step6.coApplicantFullName)}
                    />

                    <SummaryRow
                        label="Relationship"
                        value={formatReadableValue(step6.coApplicantRelationship)}
                    />

                    <SummaryRow
                        label="Income Source"
                        value={formatReadableValue(step6.coApplicantIncomeSource)}
                    />
                </SummaryCard>

                <SummaryCard title="Uploaded Documents">
                    <DocumentSummary
                        title="Identity Proof"
                        documents={step7.identityProof}
                    />

                    <DocumentSummary
                        title="Address Proof"
                        documents={step7.addressProof}
                    />

                    <DocumentSummary
                        title="Income Proof"
                        documents={step7.incomeProof}
                    />

                    <DocumentSummary
                        title="Bank Statement"
                        documents={step7.bankStatement}
                    />
                </SummaryCard>

                <SummaryCard title="Signature">
                    <SummaryRow
                        label="Signature Captured"
                        value={step7.signatureDataUrl ? 'Yes' : 'No'}
                    />

                    {step7.signatureDataUrl && (
                        <img
                            src={step7.signatureDataUrl}
                            alt="Applicant signature preview"
                            className="max-h-28 rounded-xl border border-slate-200 bg-white object-contain p-2"
                        />
                    )}
                </SummaryCard>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Checkbox
                    label="I have reviewed all application details and confirm they are correct."
                    error={errors.reviewConfirmed?.message}
                    {...register('reviewConfirmed')}
                />

                <Checkbox
                    label="I give final consent to submit this loan application for processing."
                    error={errors.finalConsent?.message}
                    {...register('finalConsent')}
                />

                <ErrorMessage
                    id="step8-review-error"
                    message={errors.reviewConfirmed?.message || errors.finalConsent?.message}
                />
            </div>
        </form>
    );
}

export default Step8ReviewSubmit;