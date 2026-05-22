import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Input,
    RadioGroup,
    Select,
} from '../common';
import {
    GENDER_OPTIONS,
    MARITAL_STATUS_OPTIONS,
} from '../../constants/personalOptions';
import { step2Schema } from '../../validations/step2Schema';

const defaultStep2Values = {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    email: '',
    mobileNumber: '',
    alternateMobileNumber: '',
};

function Step2PersonalInfo({
    formId,
    defaultValues = {},
    onSubmit,
}) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            ...defaultStep2Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

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
                    Applicant personal details
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Enter details exactly as they appear on official identity documents.
                    These details will later be matched with PAN and Aadhaar verification.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Input>
                    <Input.Label htmlFor="fullName" required>
                        Full Name as per PAN
                    </Input.Label>

                    <Input.Field
                        id="fullName"
                        name="fullName"
                        placeholder="Example: Kareem Zaydan"
                        error={errors.fullName?.message}
                        autoComplete="name"
                        {...register('fullName')}
                    />

                    <Input.HelpText>
                        Use letters, spaces, and periods only.
                    </Input.HelpText>

                    <Input.Error
                        id="fullName-error"
                        message={errors.fullName?.message}
                    />
                </Input>

                <Input>
                    <Input.Label htmlFor="dateOfBirth" required>
                        Date of Birth
                    </Input.Label>

                    <Input.Field
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        error={errors.dateOfBirth?.message}
                        autoComplete="bday"
                        {...register('dateOfBirth')}
                    />

                    <Input.HelpText>
                        Applicant age must be between 21 and 65 years.
                    </Input.HelpText>

                    <Input.Error
                        id="dateOfBirth-error"
                        message={errors.dateOfBirth?.message}
                    />
                </Input>
            </div>

            <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        name={field.name}
                        legend="Gender"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.gender?.message}
                        options={GENDER_OPTIONS}
                        direction="horizontal"
                    />
                )}
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Select
                    label="Marital Status"
                    name="maritalStatus"
                    required
                    options={MARITAL_STATUS_OPTIONS}
                    placeholder="Select marital status"
                    error={errors.maritalStatus?.message}
                    helpText="If married, spouse can be used later as co-applicant."
                    {...register('maritalStatus')}
                />

                <Input>
                    <Input.Label htmlFor="email" required>
                        Email Address
                    </Input.Label>

                    <Input.Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        error={errors.email?.message}
                        autoComplete="email"
                        {...register('email')}
                    />

                    <Input.HelpText>
                        We will use this for application communication.
                    </Input.HelpText>

                    <Input.Error
                        id="email-error"
                        message={errors.email?.message}
                    />
                </Input>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Input>
                    <Input.Label htmlFor="fatherName" required>
                        Father&apos;s Name
                    </Input.Label>

                    <Input.Field
                        id="fatherName"
                        name="fatherName"
                        placeholder="Enter father's name"
                        error={errors.fatherName?.message}
                        autoComplete="off"
                        {...register('fatherName')}
                    />

                    <Input.Error
                        id="fatherName-error"
                        message={errors.fatherName?.message}
                    />
                </Input>

                <Input>
                    <Input.Label htmlFor="motherName" required>
                        Mother&apos;s Name
                    </Input.Label>

                    <Input.Field
                        id="motherName"
                        name="motherName"
                        placeholder="Enter mother's name"
                        error={errors.motherName?.message}
                        autoComplete="off"
                        {...register('motherName')}
                    />

                    <Input.Error
                        id="motherName-error"
                        message={errors.motherName?.message}
                    />
                </Input>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Input>
                    <Input.Label htmlFor="mobileNumber" required>
                        Mobile Number
                    </Input.Label>

                    <Input.Field
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        error={errors.mobileNumber?.message}
                        autoComplete="tel"
                        {...register('mobileNumber')}
                    />

                    <Input.HelpText>
                        Must start with 6, 7, 8, or 9.
                    </Input.HelpText>

                    <Input.Error
                        id="mobileNumber-error"
                        message={errors.mobileNumber?.message}
                    />
                </Input>

                <Input>
                    <Input.Label htmlFor="alternateMobileNumber">
                        Alternate Mobile Number
                    </Input.Label>

                    <Input.Field
                        id="alternateMobileNumber"
                        name="alternateMobileNumber"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Optional alternate number"
                        error={errors.alternateMobileNumber?.message}
                        autoComplete="tel"
                        {...register('alternateMobileNumber')}
                    />

                    <Input.HelpText>
                        Optional. Must be different from primary mobile.
                    </Input.HelpText>

                    <Input.Error
                        id="alternateMobileNumber-error"
                        message={errors.alternateMobileNumber?.message}
                    />
                </Input>
            </div>
        </form>
    );
}

export default Step2PersonalInfo;