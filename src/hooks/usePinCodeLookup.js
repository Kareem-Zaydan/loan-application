import { useEffect, useState } from 'react';
import { PIN_CODE_DATA } from '../data/pinCodeData';

function usePinCodeLookup(pinCode) {
    const [result, setResult] = useState({
        isLoading: false,
        record: null,
        error: '',
    });

    useEffect(() => {
        const cleanPinCode = String(pinCode || '').replace(/\D/g, '');

        if (!cleanPinCode || cleanPinCode.length < 6) {
            setResult({
                isLoading: false,
                record: null,
                error: '',
            });

            return undefined;
        }

        setResult({
            isLoading: true,
            record: null,
            error: '',
        });

        const timerId = window.setTimeout(() => {
            const matchedRecord = PIN_CODE_DATA.find(
                (item) => item.pinCode === cleanPinCode,
            );

            if (!matchedRecord) {
                setResult({
                    isLoading: false,
                    record: null,
                    error: 'PIN code not found in the demo dataset.',
                });

                return;
            }

            setResult({
                isLoading: false,
                record: matchedRecord,
                error: '',
            });
        }, 600);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [pinCode]);

    return result;
}

export default usePinCodeLookup;