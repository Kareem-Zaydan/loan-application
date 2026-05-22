import { useState } from 'react';

const VERIFICATION_DELAY_MS = 1500;

function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function useVerification(label) {
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const verify = async (value, validator) => {
        const validationResult = validator(value);

        if (!validationResult.isValid) {
            setStatus('failed');
            setMessage(validationResult.message);

            return validationResult;
        }

        setStatus('verifying');
        setMessage(`Verifying ${label}...`);

        await wait(VERIFICATION_DELAY_MS);

        const successResult = {
            isValid: true,
            message: `${label} verified successfully.`,
        };

        setStatus('verified');
        setMessage(successResult.message);

        return successResult;
    };

    const reset = () => {
        setStatus('idle');
        setMessage('');
    };

    return {
        status,
        message,
        isVerifying: status === 'verifying',
        isVerified: status === 'verified',
        isFailed: status === 'failed',
        verify,
        reset,
    };
}

export default useVerification;