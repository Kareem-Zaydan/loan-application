import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Checkbox,
    CurrencyInput,
    ErrorMessage,
    Input,
    Select,
} from '../common';
import {
    INDIAN_STATE_OPTIONS,
    RESIDENCE_TYPE_OPTIONS,
} from '../../constants/addressOptions';
import usePinCodeLookup from '../../hooks/usePinCodeLookup';
import { step4Schema } from '../../validations/step4Schema';

const defaultStep4Values = {
    currentAddressLine1: '',
    currentAddressLine2: '',
    currentPinCode: '',
    currentCity: '',
    currentState: '',
    currentPostOffice: '',
    residenceType: '',
    rentAmount: '',
    yearsAtCurrentAddress: '',
    previousAddressLine1: '',
    previousPinCode: '',
    previousCity: '',
    previousState: '',
    sameAsPermanentAddress: true,
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentPinCode: '',
    permanentCity: '',
    permanentState: '',
    permanentPostOffice: '',
};

function LookupStatus({ lookup }) {
    if (lookup.isLoading) {
        return (
            <p className="mt-2 text-sm font-semibold text-warning">
                Looking up PIN code...
            </p>
        );
    }

    if (lookup.error) {
        return (
            <p className="mt-2 text-sm font-semibold text-error">
                {lookup.error}
            </p>
        );
    }

    if (lookup.record) {
        return (
            <p className="mt-2 text-sm font-semibold text-accent">
                ✓ Found: {lookup.record.postOffice}, {lookup.record.city}, {lookup.record.state}
            </p>
        );
    }

    return null;
}

function Step4Address({
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
        resolver: zodResolver(step4Schema),
        defaultValues: {
            ...defaultStep4Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const currentPinCode = watch('currentPinCode');
    const previousPinCode = watch('previousPinCode');
    const permanentPinCode = watch('permanentPinCode');

    const currentAddressLine1 = watch('currentAddressLine1');
    const currentAddressLine2 = watch('currentAddressLine2');
    const currentCity = watch('currentCity');
    const currentState = watch('currentState');
    const currentPostOffice = watch('currentPostOffice');

    const residenceType = watch('residenceType');
    const yearsAtCurrentAddress = watch('yearsAtCurrentAddress');
    const sameAsPermanentAddress = watch('sameAsPermanentAddress');

    const currentLookup = usePinCodeLookup(currentPinCode);
    const previousLookup = usePinCodeLookup(previousPinCode);
    const permanentLookup = usePinCodeLookup(permanentPinCode);

    const showRentAmount = residenceType === 'rented';
    const showPreviousAddress =
        yearsAtCurrentAddress !== '' && Number(yearsAtCurrentAddress) < 1;

    useEffect(() => {
        if (currentLookup.record) {
            setValue('currentCity', currentLookup.record.city, { shouldValidate: true });
            setValue('currentState', currentLookup.record.state, { shouldValidate: true });
            setValue('currentPostOffice', currentLookup.record.postOffice, {
                shouldValidate: true,
            });
        }
    }, [currentLookup.record, setValue]);

    useEffect(() => {
        if (previousLookup.record) {
            setValue('previousCity', previousLookup.record.city, { shouldValidate: true });
            setValue('previousState', previousLookup.record.state, { shouldValidate: true });
        }
    }, [previousLookup.record, setValue]);

    useEffect(() => {
        if (permanentLookup.record) {
            setValue('permanentCity', permanentLookup.record.city, { shouldValidate: true });
            setValue('permanentState', permanentLookup.record.state, { shouldValidate: true });
            setValue('permanentPostOffice', permanentLookup.record.postOffice, {
                shouldValidate: true,
            });
        }
    }, [permanentLookup.record, setValue]);

    useEffect(() => {
        if (sameAsPermanentAddress) {
            setValue('permanentAddressLine1', currentAddressLine1, {
                shouldValidate: true,
            });
            setValue('permanentAddressLine2', currentAddressLine2, {
                shouldValidate: true,
            });
            setValue('permanentPinCode', currentPinCode, { shouldValidate: true });
            setValue('permanentCity', currentCity, { shouldValidate: true });
            setValue('permanentState', currentState, { shouldValidate: true });
            setValue('permanentPostOffice', currentPostOffice, { shouldValidate: true });
        }
    }, [
        currentAddressLine1,
        currentAddressLine2,
        currentCity,
        currentPinCode,
        currentPostOffice,
        currentState,
        sameAsPermanentAddress,
        setValue,
    ]);

    const stateMismatchWarning =
        currentLookup.record
            && currentState
            && currentState !== currentLookup.record.state
            ? `Warning: selected state does not match PIN-derived state (${currentLookup.record.state}).`
            : '';

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
                    Address information
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Enter your current residential address. PIN code lookup will auto-fill
                    city, state, and post office using a simulated India Post dataset.
                </p>
            </div>

            <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                <h4 className="font-bold text-slate-900">Current Address</h4>

                <Input>
                    <Input.Label htmlFor="currentAddressLine1" required>
                        Current Address Line 1
                    </Input.Label>

                    <Input.Field
                        id="currentAddressLine1"
                        name="currentAddressLine1"
                        placeholder="House number, building, street"
                        error={errors.currentAddressLine1?.message}
                        autoComplete="address-line1"
                        {...register('currentAddressLine1')}
                    />

                    <Input.Error
                        id="currentAddressLine1-error"
                        message={errors.currentAddressLine1?.message}
                    />
                </Input>

                <Input>
                    <Input.Label htmlFor="currentAddressLine2">
                        Current Address Line 2
                    </Input.Label>

                    <Input.Field
                        id="currentAddressLine2"
                        name="currentAddressLine2"
                        placeholder="Area, landmark, locality"
                        error={errors.currentAddressLine2?.message}
                        autoComplete="address-line2"
                        {...register('currentAddressLine2')}
                    />

                    <Input.Error
                        id="currentAddressLine2-error"
                        message={errors.currentAddressLine2?.message}
                    />
                </Input>

                <div className="grid gap-5 md:grid-cols-3">
                    <Input>
                        <Input.Label htmlFor="currentPinCode" required>
                            PIN Code
                        </Input.Label>

                        <Input.Field
                            id="currentPinCode"
                            name="currentPinCode"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Example: 110001"
                            error={errors.currentPinCode?.message}
                            autoComplete="postal-code"
                            {...register('currentPinCode', {
                                onChange: (event) => {
                                    event.target.value = event.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6);
                                },
                            })}
                        />

                        <LookupStatus lookup={currentLookup} />

                        <Input.Error
                            id="currentPinCode-error"
                            message={errors.currentPinCode?.message}
                        />
                    </Input>

                    <Input>
                        <Input.Label htmlFor="currentCity" required>
                            City
                        </Input.Label>

                        <Input.Field
                            id="currentCity"
                            name="currentCity"
                            placeholder="Auto-filled city"
                            error={errors.currentCity?.message}
                            autoComplete="address-level2"
                            {...register('currentCity')}
                        />

                        <Input.Error
                            id="currentCity-error"
                            message={errors.currentCity?.message}
                        />
                    </Input>

                    <Select
                        label="State"
                        name="currentState"
                        required
                        options={INDIAN_STATE_OPTIONS}
                        placeholder="Select state"
                        error={errors.currentState?.message}
                        helpText="Auto-filled from PIN, but editable."
                        autoComplete="address-level1"
                        {...register('currentState')}
                    />
                </div>

                {stateMismatchWarning && (
                    <p className="rounded-xl bg-warning/10 p-3 text-sm font-semibold text-warning">
                        {stateMismatchWarning}
                    </p>
                )}

                <Input>
                    <Input.Label htmlFor="currentPostOffice" required>
                        Post Office
                    </Input.Label>

                    <Input.Field
                        id="currentPostOffice"
                        name="currentPostOffice"
                        placeholder="Auto-filled post office"
                        error={errors.currentPostOffice?.message}
                        {...register('currentPostOffice')}
                    />

                    <Input.Error
                        id="currentPostOffice-error"
                        message={errors.currentPostOffice?.message}
                    />
                </Input>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                <Select
                    label="Residence Type"
                    name="residenceType"
                    required
                    options={RESIDENCE_TYPE_OPTIONS}
                    placeholder="Select residence type"
                    error={errors.residenceType?.message}
                    {...register('residenceType')}
                />

                <Input>
                    <Input.Label htmlFor="yearsAtCurrentAddress" required>
                        Years at Current Address
                    </Input.Label>

                    <Input.Field
                        id="yearsAtCurrentAddress"
                        name="yearsAtCurrentAddress"
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        placeholder="Example: 2"
                        error={errors.yearsAtCurrentAddress?.message}
                        {...register('yearsAtCurrentAddress')}
                    />

                    <Input.HelpText>
                        If less than 1 year, previous address becomes required.
                    </Input.HelpText>

                    <Input.Error
                        id="yearsAtCurrentAddress-error"
                        message={errors.yearsAtCurrentAddress?.message}
                    />
                </Input>

                {showRentAmount && (
                    <Controller
                        name="rentAmount"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                label="Monthly Rent Amount"
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                required
                                placeholder="Enter monthly rent"
                                error={errors.rentAmount?.message}
                            />
                        )}
                    />
                )}
            </div>

            {showPreviousAddress && (
                <div className="space-y-5 rounded-xl border border-warning/30 bg-warning/5 p-4">
                    <h4 className="font-bold text-slate-900">
                        Previous Address Required
                    </h4>

                    <p className="text-sm text-slate-600">
                        Because current residence is less than 1 year, previous address
                        details are required.
                    </p>

                    <Input>
                        <Input.Label htmlFor="previousAddressLine1" required>
                            Previous Address Line 1
                        </Input.Label>

                        <Input.Field
                            id="previousAddressLine1"
                            name="previousAddressLine1"
                            placeholder="Previous house number, building, street"
                            error={errors.previousAddressLine1?.message}
                            {...register('previousAddressLine1')}
                        />

                        <Input.Error
                            id="previousAddressLine1-error"
                            message={errors.previousAddressLine1?.message}
                        />
                    </Input>

                    <div className="grid gap-5 md:grid-cols-3">
                        <Input>
                            <Input.Label htmlFor="previousPinCode" required>
                                Previous PIN Code
                            </Input.Label>

                            <Input.Field
                                id="previousPinCode"
                                name="previousPinCode"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Example: 400001"
                                error={errors.previousPinCode?.message}
                                {...register('previousPinCode', {
                                    onChange: (event) => {
                                        event.target.value = event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6);
                                    },
                                })}
                            />

                            <LookupStatus lookup={previousLookup} />

                            <Input.Error
                                id="previousPinCode-error"
                                message={errors.previousPinCode?.message}
                            />
                        </Input>

                        <Input>
                            <Input.Label htmlFor="previousCity" required>
                                Previous City
                            </Input.Label>

                            <Input.Field
                                id="previousCity"
                                name="previousCity"
                                placeholder="Auto-filled city"
                                error={errors.previousCity?.message}
                                {...register('previousCity')}
                            />

                            <Input.Error
                                id="previousCity-error"
                                message={errors.previousCity?.message}
                            />
                        </Input>

                        <Select
                            label="Previous State"
                            name="previousState"
                            required
                            options={INDIAN_STATE_OPTIONS}
                            placeholder="Select state"
                            error={errors.previousState?.message}
                            {...register('previousState')}
                        />
                    </div>
                </div>
            )}

            <Checkbox
                label="Permanent address is same as current address"
                helpText="Uncheck this if your permanent address is different."
                {...register('sameAsPermanentAddress')}
            />

            {!sameAsPermanentAddress && (
                <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                    <h4 className="font-bold text-slate-900">Permanent Address</h4>

                    <Input>
                        <Input.Label htmlFor="permanentAddressLine1" required>
                            Permanent Address Line 1
                        </Input.Label>

                        <Input.Field
                            id="permanentAddressLine1"
                            name="permanentAddressLine1"
                            placeholder="House number, building, street"
                            error={errors.permanentAddressLine1?.message}
                            {...register('permanentAddressLine1')}
                        />

                        <Input.Error
                            id="permanentAddressLine1-error"
                            message={errors.permanentAddressLine1?.message}
                        />
                    </Input>

                    <Input>
                        <Input.Label htmlFor="permanentAddressLine2">
                            Permanent Address Line 2
                        </Input.Label>

                        <Input.Field
                            id="permanentAddressLine2"
                            name="permanentAddressLine2"
                            placeholder="Area, landmark, locality"
                            error={errors.permanentAddressLine2?.message}
                            {...register('permanentAddressLine2')}
                        />

                        <Input.Error
                            id="permanentAddressLine2-error"
                            message={errors.permanentAddressLine2?.message}
                        />
                    </Input>

                    <div className="grid gap-5 md:grid-cols-3">
                        <Input>
                            <Input.Label htmlFor="permanentPinCode" required>
                                Permanent PIN Code
                            </Input.Label>

                            <Input.Field
                                id="permanentPinCode"
                                name="permanentPinCode"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Example: 560001"
                                error={errors.permanentPinCode?.message}
                                {...register('permanentPinCode', {
                                    onChange: (event) => {
                                        event.target.value = event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6);
                                    },
                                })}
                            />

                            <LookupStatus lookup={permanentLookup} />

                            <Input.Error
                                id="permanentPinCode-error"
                                message={errors.permanentPinCode?.message}
                            />
                        </Input>

                        <Input>
                            <Input.Label htmlFor="permanentCity" required>
                                Permanent City
                            </Input.Label>

                            <Input.Field
                                id="permanentCity"
                                name="permanentCity"
                                placeholder="Auto-filled city"
                                error={errors.permanentCity?.message}
                                {...register('permanentCity')}
                            />

                            <Input.Error
                                id="permanentCity-error"
                                message={errors.permanentCity?.message}
                            />
                        </Input>

                        <Select
                            label="Permanent State"
                            name="permanentState"
                            required
                            options={INDIAN_STATE_OPTIONS}
                            placeholder="Select state"
                            error={errors.permanentState?.message}
                            {...register('permanentState')}
                        />
                    </div>

                    <Input>
                        <Input.Label htmlFor="permanentPostOffice" required>
                            Permanent Post Office
                        </Input.Label>

                        <Input.Field
                            id="permanentPostOffice"
                            name="permanentPostOffice"
                            placeholder="Auto-filled post office"
                            error={errors.permanentPostOffice?.message}
                            {...register('permanentPostOffice')}
                        />

                        <Input.Error
                            id="permanentPostOffice-error"
                            message={errors.permanentPostOffice?.message}
                        />
                    </Input>
                </div>
            )}

            <ErrorMessage
                id="step4-global-error"
                message={errors.root?.message}
            />
        </form>
    );
}

export default Step4Address;