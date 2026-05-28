import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Checkbox,
    CurrencyInput,
    Input,
    Select,
} from '../common';
import {
    CO_APPLICANT_EMPLOYMENT_OPTIONS,
    CO_APPLICANT_INCOME_SOURCE_OPTIONS,
    CO_APPLICANT_RELATIONSHIP_OPTIONS,
} from '../../constants/coApplicantOptions';
import { step6Schema } from '../../validations/step6Schema';

const defaultStep6Values = {
    addCoApplicant: false,
    coApplicantFullName: '',
    coApplicantRelationship: '',
    coApplicantDateOfBirth: '',
    coApplicantMobile: '',
    coApplicantEmail: '',
    coApplicantPAN: '',
    coApplicantAadhaar: '',
    coApplicantEmploymentType: '',
    coApplicantIncomeSource: '',
    coApplicantMonthlyIncome: '',
    coApplicantConsent: false,
};

function Step6CoApplicant({
    formId,
    defaultValues = {},
    onSubmit,
}) {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step6Schema),
        defaultValues: {
            ...defaultStep6Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const addCoApplicant = watch('addCoApplicant');
    const coApplicantEmploymentType = watch('coApplicantEmploymentType');

    const showMonthlyIncome =
        addCoApplicant && coApplicantEmploymentType !== 'homemaker';

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
                    Co-applicant Details
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Add a co-applicant if another person will support this loan
                    application. If not, you can continue without adding one.
                </p>
            </div>

            <Checkbox
                label="I want to add a co-applicant"
                helpText="Co-applicant details are optional, but become required if this is checked."
                {...register('addCoApplicant')}
            />

            {!addCoApplicant && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="font-semibold text-slate-800">
                        No co-applicant selected.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Click Next to continue to the document upload step.
                    </p>
                </div>
            )}

            {addCoApplicant && (
                <>
                    <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                        <div>
                            <h4 className="font-bold text-slate-900">
                                Basic Information
                            </h4>

                            <p className="mt-1 text-sm text-slate-600">
                                Enter the co-applicant&apos;s personal and contact details.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Input>
                                <Input.Label htmlFor="coApplicantFullName" required>
                                    Full Name
                                </Input.Label>

                                <Input.Field
                                    id="coApplicantFullName"
                                    name="coApplicantFullName"
                                    placeholder="Example: Ahmad Zaydan"
                                    error={errors.coApplicantFullName?.message}
                                    autoComplete="name"
                                    {...register('coApplicantFullName')}
                                />

                                <Input.Error
                                    id="coApplicantFullName-error"
                                    message={errors.coApplicantFullName?.message}
                                />
                            </Input>

                            <Select
                                label="Relationship"
                                name="coApplicantRelationship"
                                required
                                options={CO_APPLICANT_RELATIONSHIP_OPTIONS}
                                placeholder="Select relationship"
                                error={errors.coApplicantRelationship?.message}
                                {...register('coApplicantRelationship')}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Input>
                                <Input.Label htmlFor="coApplicantDateOfBirth" required>
                                    Date of Birth
                                </Input.Label>

                                <Input.Field
                                    id="coApplicantDateOfBirth"
                                    name="coApplicantDateOfBirth"
                                    type="date"
                                    error={errors.coApplicantDateOfBirth?.message}
                                    {...register('coApplicantDateOfBirth')}
                                />

                                <Input.HelpText>
                                    Co-applicant must be between 21 and 70 years old.
                                </Input.HelpText>

                                <Input.Error
                                    id="coApplicantDateOfBirth-error"
                                    message={errors.coApplicantDateOfBirth?.message}
                                />
                            </Input>

                            <Input>
                                <Input.Label htmlFor="coApplicantMobile" required>
                                    Mobile Number
                                </Input.Label>

                                <Input.Field
                                    id="coApplicantMobile"
                                    name="coApplicantMobile"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="Example: 9876543210"
                                    error={errors.coApplicantMobile?.message}
                                    autoComplete="tel"
                                    {...register('coApplicantMobile', {
                                        onChange: (event) => {
                                            event.target.value = event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 10);
                                        },
                                    })}
                                />

                                <Input.Error
                                    id="coApplicantMobile-error"
                                    message={errors.coApplicantMobile?.message}
                                />
                            </Input>
                        </div>

                        <Input>
                            <Input.Label htmlFor="coApplicantEmail">
                                Email Address
                            </Input.Label>

                            <Input.Field
                                id="coApplicantEmail"
                                name="coApplicantEmail"
                                type="email"
                                placeholder="Example: coapplicant@example.com"
                                error={errors.coApplicantEmail?.message}
                                autoComplete="email"
                                {...register('coApplicantEmail')}
                            />

                            <Input.HelpText>
                                Optional, but must be valid if provided.
                            </Input.HelpText>

                            <Input.Error
                                id="coApplicantEmail-error"
                                message={errors.coApplicantEmail?.message}
                            />
                        </Input>
                    </div>

                    <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                        <div>
                            <h4 className="font-bold text-slate-900">
                                KYC Information
                            </h4>

                            <p className="mt-1 text-sm text-slate-600">
                                PAN and Aadhaar are required for co-applicant verification.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Input>
                                <Input.Label htmlFor="coApplicantPAN" required>
                                    PAN Number
                                </Input.Label>

                                <Input.Field
                                    id="coApplicantPAN"
                                    name="coApplicantPAN"
                                    maxLength={10}
                                    placeholder="Example: AAAPA9999A"
                                    error={errors.coApplicantPAN?.message}
                                    {...register('coApplicantPAN', {
                                        onChange: (event) => {
                                            event.target.value = event.target.value
                                                .replace(/[^a-zA-Z0-9]/g, '')
                                                .toUpperCase()
                                                .slice(0, 10);
                                        },
                                    })}
                                />

                                <Input.Error
                                    id="coApplicantPAN-error"
                                    message={errors.coApplicantPAN?.message}
                                />
                            </Input>

                            <Input>
                                <Input.Label htmlFor="coApplicantAadhaar" required>
                                    Aadhaar Number
                                </Input.Label>

                                <Input.Field
                                    id="coApplicantAadhaar"
                                    name="coApplicantAadhaar"
                                    inputMode="numeric"
                                    maxLength={12}
                                    placeholder="Enter 12-digit Aadhaar"
                                    error={errors.coApplicantAadhaar?.message}
                                    {...register('coApplicantAadhaar', {
                                        onChange: (event) => {
                                            event.target.value = event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 12);
                                        },
                                    })}
                                />

                                <Input.Error
                                    id="coApplicantAadhaar-error"
                                    message={errors.coApplicantAadhaar?.message}
                                />
                            </Input>
                        </div>
                    </div>

                    <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                        <div>
                            <h4 className="font-bold text-slate-900">
                                Income Details
                            </h4>

                            <p className="mt-1 text-sm text-slate-600">
                                Co-applicant income helps improve loan eligibility.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Select
                                label="Employment Type"
                                name="coApplicantEmploymentType"
                                required
                                options={CO_APPLICANT_EMPLOYMENT_OPTIONS}
                                placeholder="Select employment type"
                                error={errors.coApplicantEmploymentType?.message}
                                {...register('coApplicantEmploymentType')}
                            />

                            <Select
                                label="Income Source"
                                name="coApplicantIncomeSource"
                                required
                                options={CO_APPLICANT_INCOME_SOURCE_OPTIONS}
                                placeholder="Select income source"
                                error={errors.coApplicantIncomeSource?.message}
                                {...register('coApplicantIncomeSource')}
                            />
                        </div>

                        {showMonthlyIncome && (
                            <Controller
                                name="coApplicantMonthlyIncome"
                                control={control}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Monthly Income"
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        required
                                        placeholder="Enter monthly income"
                                        error={errors.coApplicantMonthlyIncome?.message}
                                        helpText="Minimum required income is ₹10,000 unless co-applicant is homemaker."
                                    />
                                )}
                            />
                        )}

                        {coApplicantEmploymentType === 'homemaker' && (
                            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                Monthly income is not required for homemaker co-applicants.
                            </div>
                        )}
                    </div>

                    <Checkbox
                        label="I confirm that the co-applicant has given consent to be added to this loan application."
                        helpText="Consent is required before submitting co-applicant details."
                        error={errors.coApplicantConsent?.message}
                        {...register('coApplicantConsent')}
                    />
                </>
            )}
        </form>
    );
}

export default Step6CoApplicant;