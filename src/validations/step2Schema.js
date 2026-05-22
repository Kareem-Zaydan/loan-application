import { z } from 'zod';

const nameRegex = /^[A-Za-z .]+$/;
const mobileRegex = /^[6-9]\d{9}$/;

function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassedThisYear =
        today.getMonth() > birthDate.getMonth()
        || (
            today.getMonth() === birthDate.getMonth()
            && today.getDate() >= birthDate.getDate()
        );

    if (!hasBirthdayPassedThisYear) {
        age -= 1;
    }

    return age;
}

const nameField = (fieldName) => z
    .string()
    .trim()
    .min(2, `${fieldName} must be at least 2 characters.`)
    .max(100, `${fieldName} must not exceed 100 characters.`)
    .regex(
        nameRegex,
        `${fieldName} can contain only letters, spaces, and periods.`,
    );

export const step2Schema = z
    .object({
        fullName: nameField('Full name'),
        dateOfBirth: z
            .string()
            .min(1, 'Date of birth is required.')
            .refine((value) => !Number.isNaN(new Date(value).getTime()), {
                message: 'Please enter a valid date of birth.',
            })
            .refine((value) => calculateAge(value) >= 21, {
                message: 'Applicant must be at least 21 years old.',
            })
            .refine((value) => calculateAge(value) <= 65, {
                message: 'Applicant age must not exceed 65 years.',
            }),
        gender: z.enum(['male', 'female', 'other'], {
            required_error: 'Please select gender.',
            invalid_type_error: 'Please select gender.',
        }),
        maritalStatus: z
            .string()
            .min(1, 'Please select marital status.'),
        fatherName: nameField("Father's name"),
        motherName: nameField("Mother's name"),
        email: z
            .string()
            .trim()
            .min(1, 'Email address is required.')
            .email('Please enter a valid email address.'),
        mobileNumber: z
            .string()
            .trim()
            .regex(
                mobileRegex,
                'Mobile number must be 10 digits and start with 6, 7, 8, or 9.',
            ),
        alternateMobileNumber: z
            .string()
            .trim()
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.alternateMobileNumber
            && !mobileRegex.test(data.alternateMobileNumber)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['alternateMobileNumber'],
                message: 'Alternate mobile must be 10 digits and start with 6, 7, 8, or 9.',
            });
        }

        if (
            data.alternateMobileNumber
            && data.alternateMobileNumber === data.mobileNumber
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['alternateMobileNumber'],
                message: 'Alternate mobile must be different from primary mobile.',
            });
        }
    });