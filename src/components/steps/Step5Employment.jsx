import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CurrencyInput,
    Input,
    RadioGroup,
    Select,
} from '../common';
import {
    BUSINESS_TYPE_OPTIONS,
    COMPANY_SUGGESTIONS,
    EMPLOYMENT_TYPE_OPTIONS,
} from '../../constants/employmentOptions';
import { INDIAN_STATE_OPTIONS } from '../../constants/addressOptions';
import { createStep5Schema } from '../../validations/step5Schema';

const defaultStep5Values = {
    employmentType: '',
    companyName: '',
    designation: '',
    monthlyNetSalary: '',
    yearsOfExperience: '',
    businessName: '',
    businessType: '',
    annualTurnover: '',
    yearsInBusiness: '',
    monthlyIncome: '',
    gstNumber: '',
    officeAddressLine1: '',
    officeCity: '',
    officeState: '',
    officePinCode: '',
};

function Step5Employment({
    formId,
    defaultValues = {},
    loanType = 'personal',
    onSubmit,
}) {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createStep5Schema({ loanType })),
        defaultValues: {
            ...defaultStep5Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const employmentType = watch('employmentType');

    const isSalaried = employmentType === 'salaried';
    const isSelfEmployed = employmentType === 'self_employed';
    const isBusinessOwner = employmentType === 'business_owner';
    const showBusinessFields = isSelfEmployed || isBusinessOwner;

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
                    Employment & Income Details
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Select your employment type. The form will show different fields for
                    salaried, self-employed, and business owner applicants.
                </p>

                {loanType === 'business' && (
                    <p className="mt-3 rounded-xl bg-warning/10 p-3 text-sm font-semibold text-warning">
                        Business Loan rule: employment type must be Self-Employed or
                        Business Owner. Salaried applicants cannot continue for Business Loan.
                    </p>
                )}
            </div>

            <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        name={field.name}
                        legend="Employment Type"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.employmentType?.message}
                        options={EMPLOYMENT_TYPE_OPTIONS}
                        direction="horizontal"
                    />
                )}
            />

            {isSalaried && (
                <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                    <div>
                        <h4 className="font-bold text-slate-900">
                            Salaried Employment Details
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">
                            Salary details will later be used for EMI affordability checks.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Input>
                            <Input.Label htmlFor="companyName" required>
                                Company Name
                            </Input.Label>

                            <Input.Field
                                id="companyName"
                                name="companyName"
                                list="company-suggestions"
                                placeholder="Example: HDFC Bank"
                                error={errors.companyName?.message}
                                autoComplete="organization"
                                {...register('companyName')}
                            />

                            <datalist id="company-suggestions">
                                {COMPANY_SUGGESTIONS.map((company) => (
                                    <option key={company} value={company} />
                                ))}
                            </datalist>

                            <Input.HelpText>
                                Start typing to use demo company suggestions.
                            </Input.HelpText>

                            <Input.Error
                                id="companyName-error"
                                message={errors.companyName?.message}
                            />
                        </Input>

                        <Input>
                            <Input.Label htmlFor="designation" required>
                                Designation
                            </Input.Label>

                            <Input.Field
                                id="designation"
                                name="designation"
                                placeholder="Example: Software Engineer"
                                error={errors.designation?.message}
                                autoComplete="organization-title"
                                {...register('designation')}
                            />

                            <Input.Error
                                id="designation-error"
                                message={errors.designation?.message}
                            />
                        </Input>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="monthlyNetSalary"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    label="Monthly Net Salary"
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    required
                                    placeholder="Enter salary"
                                    error={errors.monthlyNetSalary?.message}
                                    helpText="Minimum salary required: ₹15,000."
                                />
                            )}
                        />

                        <Input>
                            <Input.Label htmlFor="yearsOfExperience" required>
                                Years of Experience
                            </Input.Label>

                            <Input.Field
                                id="yearsOfExperience"
                                name="yearsOfExperience"
                                type="number"
                                min="0"
                                max="50"
                                step="0.5"
                                placeholder="Example: 3"
                                error={errors.yearsOfExperience?.message}
                                {...register('yearsOfExperience')}
                            />

                            <Input.Error
                                id="yearsOfExperience-error"
                                message={errors.yearsOfExperience?.message}
                            />
                        </Input>
                    </div>
                </div>
            )}

            {showBusinessFields && (
                <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                    <div>
                        <h4 className="font-bold text-slate-900">
                            Business / Self-Employment Details
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">
                            These fields are required for self-employed and business owner
                            applicants.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Input>
                            <Input.Label htmlFor="businessName" required>
                                Business Name
                            </Input.Label>

                            <Input.Field
                                id="businessName"
                                name="businessName"
                                placeholder="Example: Zaydan Trading"
                                error={errors.businessName?.message}
                                autoComplete="organization"
                                {...register('businessName')}
                            />

                            <Input.Error
                                id="businessName-error"
                                message={errors.businessName?.message}
                            />
                        </Input>

                        <Select
                            label="Business Type"
                            name="businessType"
                            required
                            options={BUSINESS_TYPE_OPTIONS}
                            placeholder="Select business type"
                            error={errors.businessType?.message}
                            {...register('businessType')}
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <Controller
                            name="annualTurnover"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    label="Annual Turnover"
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    required
                                    placeholder="Enter turnover"
                                    error={errors.annualTurnover?.message}
                                    helpText="Minimum required: ₹3,00,000."
                                />
                            )}
                        />

                        <Input>
                            <Input.Label htmlFor="yearsInBusiness" required>
                                Years in Business
                            </Input.Label>

                            <Input.Field
                                id="yearsInBusiness"
                                name="yearsInBusiness"
                                type="number"
                                min="0"
                                max="50"
                                step="0.5"
                                placeholder="Example: 4"
                                error={errors.yearsInBusiness?.message}
                                {...register('yearsInBusiness')}
                            />

                            <Input.HelpText>
                                Minimum required: 2 years.
                            </Input.HelpText>

                            <Input.Error
                                id="yearsInBusiness-error"
                                message={errors.yearsInBusiness?.message}
                            />
                        </Input>

                        {isSelfEmployed && (
                            <Controller
                                name="monthlyIncome"
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
                                        error={errors.monthlyIncome?.message}
                                        helpText="Minimum income required: ₹15,000."
                                    />
                                )}
                            />
                        )}
                    </div>

                    {isBusinessOwner && (
                        <Input>
                            <Input.Label htmlFor="gstNumber" required>
                                GST Number
                            </Input.Label>

                            <Input.Field
                                id="gstNumber"
                                name="gstNumber"
                                maxLength={15}
                                placeholder="Example: 27AAAPA9999A1Z5"
                                error={errors.gstNumber?.message}
                                {...register('gstNumber', {
                                    onChange: (event) => {
                                        event.target.value = event.target.value
                                            .replace(/[^a-zA-Z0-9]/g, '')
                                            .toUpperCase()
                                            .slice(0, 15);
                                    },
                                })}
                            />

                            <Input.HelpText>
                                GSTIN format: 2 digits + PAN + entity code + Z + checksum.
                            </Input.HelpText>

                            <Input.Error
                                id="gstNumber-error"
                                message={errors.gstNumber?.message}
                            />
                        </Input>
                    )}

                    <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h5 className="font-bold text-slate-900">
                            Office / Business Address
                        </h5>

                        <Input>
                            <Input.Label htmlFor="officeAddressLine1" required>
                                Office Address Line 1
                            </Input.Label>

                            <Input.Field
                                id="officeAddressLine1"
                                name="officeAddressLine1"
                                placeholder="Office number, building, street"
                                error={errors.officeAddressLine1?.message}
                                autoComplete="address-line1"
                                {...register('officeAddressLine1')}
                            />

                            <Input.Error
                                id="officeAddressLine1-error"
                                message={errors.officeAddressLine1?.message}
                            />
                        </Input>

                        <div className="grid gap-5 md:grid-cols-3">
                            <Input>
                                <Input.Label htmlFor="officeCity" required>
                                    Office City
                                </Input.Label>

                                <Input.Field
                                    id="officeCity"
                                    name="officeCity"
                                    placeholder="Example: Mumbai"
                                    error={errors.officeCity?.message}
                                    autoComplete="address-level2"
                                    {...register('officeCity')}
                                />

                                <Input.Error
                                    id="officeCity-error"
                                    message={errors.officeCity?.message}
                                />
                            </Input>

                            <Select
                                label="Office State"
                                name="officeState"
                                options={INDIAN_STATE_OPTIONS}
                                placeholder="Select state"
                                error={errors.officeState?.message}
                                autoComplete="address-level1"
                                {...register('officeState')}
                            />

                            <Input>
                                <Input.Label htmlFor="officePinCode" required>
                                    Office PIN Code
                                </Input.Label>

                                <Input.Field
                                    id="officePinCode"
                                    name="officePinCode"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Example: 400001"
                                    error={errors.officePinCode?.message}
                                    autoComplete="postal-code"
                                    {...register('officePinCode', {
                                        onChange: (event) => {
                                            event.target.value = event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 6);
                                        },
                                    })}
                                />

                                <Input.Error
                                    id="officePinCode-error"
                                    message={errors.officePinCode?.message}
                                />
                            </Input>
                        </div>
                    </div>
                </div>
            )}

            {!employmentType && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="font-semibold text-slate-800">
                        Select an employment type to continue.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        The required fields will appear dynamically based on your selection.
                    </p>
                </div>
            )}
        </form>
    );
}

export default Step5Employment;