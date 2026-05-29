import { useEffect, useRef, useState } from 'react';
import {
    AUTO_SAVE_DEBOUNCE_MS,
    AUTO_SAVE_STORAGE_KEY,
    AUTO_SAVE_VERSION,
} from '../constants/storageKeys';
import {
    hasEncryptedItem,
    readEncryptedItem,
    removeEncryptedItem,
    saveEncryptedItem,
} from '../utils/secureStorage';

function removeTemporaryDocumentPreviewUrls(applicationData) {
    const cleanData = structuredClone(applicationData);

    const step7 = cleanData.step7;

    if (!step7) {
        return cleanData;
    }

    const documentFields = [
        'identityProof',
        'addressProof',
        'incomeProof',
        'bankStatement',
    ];

    documentFields.forEach((fieldName) => {
        if (!Array.isArray(step7[fieldName])) {
            return;
        }

        step7[fieldName] = step7[fieldName].map((documentRecord) => ({
            ...documentRecord,
            previewUrl: '',
            restoredFromDraft: true,
        }));
    });

    if (step7.signatureDataUrl) {
        step7.signatureDataUrl = '';
        step7.signatureNeedsRedraw = true;
    }

    return cleanData;
}

function createAutoSavePayload(applicationData, currentStepIndex) {
    return {
        version: AUTO_SAVE_VERSION,
        savedAt: new Date().toISOString(),
        currentStepIndex,
        applicationData: removeTemporaryDocumentPreviewUrls(applicationData),
    };
}

function useEncryptedAutoSave(
    applicationData,
    currentStepIndex,
    { enabled = true } = {},
) {
    const [hasDraft, setHasDraft] = useState(false);
    const [hasCheckedForDraft, setHasCheckedForDraft] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [autoSaveError, setAutoSaveError] = useState('');

    const didInitialCheckRef = useRef(false);

    useEffect(() => {
        if (didInitialCheckRef.current) {
            return;
        }

        didInitialCheckRef.current = true;
        setHasDraft(hasEncryptedItem(AUTO_SAVE_STORAGE_KEY));
        setHasCheckedForDraft(true);
    }, []);

    useEffect(() => {
        if (!enabled || !hasCheckedForDraft) {
            return undefined;
        }

        const timerId = window.setTimeout(async () => {
            try {
                setIsSaving(true);
                setAutoSaveError('');

                const payload = createAutoSavePayload(
                    applicationData,
                    currentStepIndex,
                );

                await saveEncryptedItem(AUTO_SAVE_STORAGE_KEY, payload);

                setLastSavedAt(payload.savedAt);
                setHasDraft(true);
            } catch {
                setAutoSaveError('Auto-save failed. Your current session still works.');
            } finally {
                setIsSaving(false);
            }
        }, AUTO_SAVE_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [
        applicationData,
        currentStepIndex,
        enabled,
        hasCheckedForDraft,
    ]);

    const loadDraft = async () => {
        const draft = await readEncryptedItem(AUTO_SAVE_STORAGE_KEY);

        if (!draft?.applicationData) {
            return null;
        }

        return draft;
    };

    const clearDraft = () => {
        removeEncryptedItem(AUTO_SAVE_STORAGE_KEY);
        setHasDraft(false);
        setLastSavedAt('');
    };

    return {
        hasDraft,
        hasCheckedForDraft,
        lastSavedAt,
        isSaving,
        autoSaveError,
        loadDraft,
        clearDraft,
    };
}

export default useEncryptedAutoSave;