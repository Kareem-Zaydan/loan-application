import { useEffect, useState } from 'react';
import { PIN_CODE_DATA } from '../data/pinCodeData';

function usePinCodeLookup(pinCode) {
    const cleanPinCode = String(pinCode || '').replace(/\D/g, '');

    const [lookupResult, setLookupResult] = useState({
        pinCode: '',
        record: null,
        error: '',
    });

    useEffect(() => {
        if (cleanPinCode.length !== 6) {
            return undefined;
        }

        const timerId = window.setTimeout(() => {
            const matchedRecord = PIN_CODE_DATA.find(
                (item) => item.pinCode === cleanPinCode,
            );

            if (!matchedRecord) {
                setLookupResult({
                    pinCode: cleanPinCode,
                    record: null,
                    error: 'PIN code not found in the demo dataset.',
                });

                return;
            }

            setLookupResult({
                pinCode: cleanPinCode,
                record: matchedRecord,
                error: '',
            });
        }, 600);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [cleanPinCode]);

    if (cleanPinCode.length !== 6) {
        return {
            isLoading: false,
            record: null,
            error: '',
        };
    }

    if (lookupResult.pinCode !== cleanPinCode) {
        return {
            isLoading: true,
            record: null,
            error: '',
        };
    }

    return {
        isLoading: false,
        record: lookupResult.record,
        error: lookupResult.error,
    };
}

export default usePinCodeLookup;