import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CurrencyInput,
    Input,
    RadioGroup,
    Select,
} from '../common';
import {
    LOAN_AMOUNT_LIMITS,
    LOAN_PURPOSE_OPTIONS,
    LOAN_TYPES,
    TENURE_LIMITS,
    TENURE_OPTIONS,
} from '../../constants/loanOptions';
import { step1Schema } from '../../validations/step1Schema';

const defaultStep1Values = {
    loanType: '',
    loanAmount: '',
    tenureMonths: '',
    loanPurpose: '',
    referralCode: '',
};

function Step1LoanType({
    formId,
    defaultValues = {},
    onSubmit,
}) {
    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            ...defaultStep1Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const selectedLoanType = watch('loanType');
    const previousLoanTypeRef = useRef(selectedLoanType);

    const amountLimit = LOAN_AMOUNT_LIMITS[selectedLoanType];
    const tenureLimit = TENURE_LIMITS[selectedLoanType];
    const tenureOptions = TENURE_OPTIONS[selectedLoanType] || [];
    const purposeOptions = LOAN_PURPOSE_OPTIONS[selectedLoanType] || [];

    useEffect(() => {
        const previousLoanType = previousLoanTypeRef.current;

        if (previousLoanType && previousLoanType !== selectedLoanType) {
            setValue('tenureMonths', '', { shouldValidate: true });
            setValue('loanPurpose', '', { shouldValidate: true });
        }

        previousLoanTypeRef.current = selectedLoanType;
    }, [selectedLoanType, setValue]);

    const submitStep = (values) => {
        onSubmit(values);
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(submitStep)}
            className="space-y-6"
            noValidate
        >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-bold text-slate-900">
                    Choose your loan product
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Your selection controls loan limits, tenure options, purpose options,
                    document requirements, and later co-applicant rules.
                </p>
            </div>

            <Controller
                name="loanType"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        name={field.name}
                        legend="Loan Type"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.loanType?.message}
                        options={LOAN_TYPES.map((loanType) => ({
                            value: loanType.value,
                            label: loanType.label,
                        }))}
                        direction="horizontal"
                    />
                )}
            />

            {selectedLoanType && (
                <div className="grid gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:grid-cols-3">
                    {LOAN_TYPES.filter((loanType) => loanType.value === selectedLoanType).map(
                        (loanType) => (
                            <div key={loanType.value} className="sm:col-span-3">
                                <p className="text-sm font-semibold text-primary">
                                    {loanType.label}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {loanType.description}
                                </p>
                            </div>
                        ),
                    )}

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Amount Range
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {amountLimit?.label}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Tenure Range
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {tenureLimit?.label}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Purpose Options
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {purposeOptions.length} available
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                <Controller
                    name="loanAmount"
                    control={control}
                    render={({ field }) => (
                        <CurrencyInput
                            label="Loan Amount"
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            required
                            placeholder="Enter amount"
                            error={errors.loanAmount?.message}
                            helpText={
                                amountLimit
                                    ? `Allowed range: ${amountLimit.label}`
                                    : 'Select a loan type first to see the allowed amount range.'
                            }
                        />
                    )}
                />

                <Select
                    label="Loan Tenure"
                    name="tenureMonths"
                    required
                    options={tenureOptions}
                    placeholder={
                        selectedLoanType
                            ? 'Select tenure'
                            : 'Select loan type first'
                    }
                    disabled={!selectedLoanType}
                    error={errors.tenureMonths?.message}
                    helpText={
                        tenureLimit
                            ? `Allowed tenure: ${tenureLimit.label}`
                            : 'Tenure options depend on loan type.'
                    }
                    {...register('tenureMonths')}
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Select
                    label="Loan Purpose"
                    name="loanPurpose"
                    required
                    options={purposeOptions}
                    placeholder={
                        selectedLoanType
                            ? 'Select purpose'
                            : 'Select loan type first'
                    }
                    disabled={!selectedLoanType}
                    error={errors.loanPurpose?.message}
                    helpText="Purpose options change based on the selected loan type."
                    {...register('loanPurpose')}
                />

                <Input>
                    <Input.Label htmlFor="referralCode">
                        Referral Code
                    </Input.Label>

                    <Input.Field
                        id="referralCode"
                        name="referralCode"
                        placeholder="Optional, e.g. LS2026"
                        error={errors.referralCode?.message}
                        {...register('referralCode')}
                    />

                    <Input.HelpText>
                        Optional. Use 6 to 10 letters or numbers only.
                    </Input.HelpText>

                    <Input.Error
                        id="referralCode-error"
                        message={errors.referralCode?.message}
                    />
                </Input>
            </div>
        </form>
    );
}

export default Step1LoanType;