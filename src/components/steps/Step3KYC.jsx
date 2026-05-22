import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Checkbox,
    ErrorMessage,
    Input,
} from '../common';
import { getLoanTypeLabel } from '../../constants/loanOptions';
import useVerification from '../../hooks/useVerification';
import { createStep3Schema } from '../../validations/step3Schema';
import {
    normalizeDigits,
    normalizePAN,
    validateAadhaarNumber,
    validatePanNumber,
} from '../../utils/kycValidators';

const defaultStep3Values = {
    panNumber: '',
    panVerified: false,
    aadhaarNumber: '',
    aadhaarVerified: false,
    aadhaarConsent: false,
    voterId: '',
    passportNumber: '',
};

function VerificationBadge({ status, message }) {
    if (status === 'idle') {
        return null;
    }

    if (status === 'verifying') {
        return (
            <p className="mt-2 text-sm font-semibold text-warning">
                ⏳ {message}
            </p>
        );
    }

    if (status === 'verified') {
        return (
            <p className="mt-2 text-sm font-semibold text-accent">
                ✓ {message}
            </p>
        );
    }

    return (
        <p className="mt-2 text-sm font-semibold text-error">
            ✕ {message}
        </p>
    );
}

function Step3KYC({
    formId,
    defaultValues = {},
    loanType = 'personal',
    loanAmount = 0,
    onSubmit,
}) {
    const requiresPassport =
        loanType === 'home' && Number(loanAmount) > 5000000;

    const panVerification = useVerification('PAN');
    const aadhaarVerification = useVerification('Aadhaar');

    const {
        control,
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createStep3Schema({
            loanType,
            requiresPassport,
        })),
        defaultValues: {
            ...defaultStep3Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const handlePanVerification = async (value) => {
        const result = await panVerification.verify(
            value,
            (currentValue) => validatePanNumber(currentValue, loanType),
        );

        setValue('panVerified', result.isValid, {
            shouldDirty: true,
            shouldValidate: true,
        });

        trigger('panVerified');
    };

    const handleAadhaarVerification = async (value) => {
        const result = await aadhaarVerification.verify(
            value,
            validateAadhaarNumber,
        );

        setValue('aadhaarVerified', result.isValid, {
            shouldDirty: true,
            shouldValidate: true,
        });

        trigger('aadhaarVerified');
    };

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
                    Identity Verification / KYC
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    This step simulates PAN and Aadhaar verification for a{' '}
                    <span className="font-semibold text-primary">
                        {getLoanTypeLabel(loanType)}
                    </span>
                    . Verification uses format checks and a 1.5 second mock API delay.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Controller
                    name="panNumber"
                    control={control}
                    render={({ field }) => (
                        <Input>
                            <Input.Label htmlFor="panNumber" required>
                                PAN Number
                            </Input.Label>

                            <Input.Field
                                id="panNumber"
                                name={field.name}
                                value={field.value}
                                maxLength={10}
                                placeholder="Example: ABCPD1234F"
                                error={errors.panNumber?.message}
                                onChange={(event) => {
                                    const normalizedValue = normalizePAN(event.target.value);
                                    field.onChange(normalizedValue);
                                    setValue('panVerified', false, { shouldValidate: true });
                                    panVerification.reset();
                                }}
                                onBlur={(event) => {
                                    field.onBlur();
                                    if (event.target.value.length === 10) {
                                        handlePanVerification(event.target.value);
                                    }
                                }}
                            />

                            <Input.HelpText>
                                Format: AAAAA9999A. For personal/home loans, the 4th character
                                must be P.
                            </Input.HelpText>

                            <Input.Error
                                id="panNumber-error"
                                message={errors.panNumber?.message}
                            />

                            <VerificationBadge
                                status={panVerification.status}
                                message={panVerification.message}
                            />

                            <ErrorMessage
                                id="panVerified-error"
                                message={errors.panVerified?.message}
                            />

                            <button
                                type="button"
                                onClick={() => handlePanVerification(field.value)}
                                disabled={panVerification.isVerifying}
                                className="mt-3 min-h-11 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {panVerification.isVerifying ? 'Verifying PAN...' : 'Verify PAN'}
                            </button>
                        </Input>
                    )}
                />

                <Controller
                    name="aadhaarNumber"
                    control={control}
                    render={({ field }) => (
                        <Input>
                            <Input.Label htmlFor="aadhaarNumber" required>
                                Aadhaar Number
                            </Input.Label>

                            <Input.Field
                                id="aadhaarNumber"
                                name={field.name}
                                value={field.value}
                                inputMode="numeric"
                                maxLength={12}
                                placeholder="Example: 999999990019"
                                error={errors.aadhaarNumber?.message}
                                onChange={(event) => {
                                    const normalizedValue = normalizeDigits(event.target.value, 12);
                                    field.onChange(normalizedValue);
                                    setValue('aadhaarVerified', false, { shouldValidate: true });
                                    aadhaarVerification.reset();
                                }}
                                onBlur={(event) => {
                                    field.onBlur();
                                    if (event.target.value.length === 12) {
                                        handleAadhaarVerification(event.target.value);
                                    }
                                }}
                            />

                            <Input.HelpText>
                                Must be 12 digits and pass Verhoeff checksum validation.
                            </Input.HelpText>

                            <Input.Error
                                id="aadhaarNumber-error"
                                message={errors.aadhaarNumber?.message}
                            />

                            <VerificationBadge
                                status={aadhaarVerification.status}
                                message={aadhaarVerification.message}
                            />

                            <ErrorMessage
                                id="aadhaarVerified-error"
                                message={errors.aadhaarVerified?.message}
                            />

                            <button
                                type="button"
                                onClick={() => handleAadhaarVerification(field.value)}
                                disabled={aadhaarVerification.isVerifying}
                                className="mt-3 min-h-11 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {aadhaarVerification.isVerifying
                                    ? 'Verifying Aadhaar...'
                                    : 'Verify Aadhaar'}
                            </button>
                        </Input>
                    )}
                />
            </div>

            <Checkbox
                label="I consent to Aadhaar verification for identity validation and loan application processing."
                error={errors.aadhaarConsent?.message}
                helpText="This is a simulated consent flow for the project. Real Aadhaar verification requires authorised API integration."
                {...register('aadhaarConsent')}
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Input>
                    <Input.Label htmlFor="voterId">
                        Voter ID
                    </Input.Label>

                    <Input.Field
                        id="voterId"
                        name="voterId"
                        placeholder="Optional, e.g. ABC1234567"
                        error={errors.voterId?.message}
                        maxLength={10}
                        {...register('voterId', {
                            onChange: (event) => {
                                event.target.value = event.target.value
                                    .replace(/[^a-zA-Z0-9]/g, '')
                                    .toUpperCase()
                                    .slice(0, 10);
                            },
                        })}
                    />

                    <Input.HelpText>
                        Optional. Format: 3 letters followed by 7 digits.
                    </Input.HelpText>

                    <Input.Error
                        id="voterId-error"
                        message={errors.voterId?.message}
                    />
                </Input>

                {requiresPassport && (
                    <Input>
                        <Input.Label htmlFor="passportNumber" required>
                            Passport Number
                        </Input.Label>

                        <Input.Field
                            id="passportNumber"
                            name="passportNumber"
                            placeholder="Example: A1234567"
                            error={errors.passportNumber?.message}
                            maxLength={8}
                            {...register('passportNumber', {
                                onChange: (event) => {
                                    event.target.value = event.target.value
                                        .replace(/[^a-zA-Z0-9]/g, '')
                                        .toUpperCase()
                                        .slice(0, 8);
                                },
                            })}
                        />

                        <Input.HelpText>
                            Required for Home Loans above ₹50,00,000.
                        </Input.HelpText>

                        <Input.Error
                            id="passportNumber-error"
                            message={errors.passportNumber?.message}
                        />
                    </Input>
                )}
            </div>
        </form>
    );
}

export default Step3KYC;