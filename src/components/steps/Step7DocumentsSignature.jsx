import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Checkbox,
    ErrorMessage,
} from '../common';
import {
    ACCEPTED_DOCUMENT_TYPES,
    DOCUMENT_REQUIREMENTS,
    MAX_DOCUMENT_SIZE_BYTES,
    SIGNATURE_DECLARATION,
} from '../../constants/documentOptions';
import {
    compressImageFile,
    createDocumentRecord,
    formatFileSize,
    revokePreviewUrl,
} from '../../utils/fileHelpers';
import { step7Schema } from '../../validations/step7Schema';

const defaultStep7Values = {
    identityProof: [],
    addressProof: [],
    incomeProof: [],
    bankStatement: [],
    signatureDataUrl: '',
    documentConsent: false,
};

function DocumentUploadCard({
    requirement,
    documents,
    error,
    onUpload,
    onRemove,
}) {
    const [uploadError, setUploadError] = useState('');
    const [isCompressing, setIsCompressing] = useState(false);

    const handleDrop = async (acceptedFiles, rejectedFiles) => {
        setUploadError('');

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];

            if (rejection.file.size > MAX_DOCUMENT_SIZE_BYTES) {
                setUploadError('File is too large. Maximum allowed size is 5 MB.');
                return;
            }

            setUploadError('Unsupported file type. Please upload PDF, JPG, or PNG.');
            return;
        }

        const file = acceptedFiles[0];

        if (!file) {
            return;
        }

        try {
            setIsCompressing(true);
            const compressedFile = await compressImageFile(file);
            const documentRecord = createDocumentRecord(file, compressedFile);

            onUpload(requirement.key, documentRecord);
        } catch {
            setUploadError('Could not process this file. Please try another file.');
        } finally {
            setIsCompressing(false);
        }
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        accept: ACCEPTED_DOCUMENT_TYPES,
        maxSize: MAX_DOCUMENT_SIZE_BYTES,
        multiple: false,
        onDrop: handleDrop,
    });

    const uploadedDocument = documents[0];

    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-4">
                <h4 className="font-bold text-slate-900">
                    {requirement.title}
                    {requirement.required && (
                        <span className="ml-1 text-error">*</span>
                    )}
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                    {requirement.description}
                </p>
            </div>

            {!uploadedDocument && (
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${isDragActive
                            ? 'border-accent bg-accent/10'
                            : 'border-slate-300 bg-slate-50 hover:border-accent'
                        }`}
                >
                    <input {...getInputProps()} />

                    <p className="font-semibold text-slate-800">
                        {isDragActive ? 'Drop the file here' : 'Drag & drop document here'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        or click to choose PDF, JPG, or PNG. Max size: 5 MB.
                    </p>

                    {isCompressing && (
                        <p className="mt-3 text-sm font-semibold text-warning">
                            Compressing image...
                        </p>
                    )}
                </div>
            )}

            {uploadedDocument && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">
                                {uploadedDocument.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Size: {formatFileSize(uploadedDocument.size)}
                            </p>

                            {uploadedDocument.compressionSavedBytes > 0 && (
                                <p className="mt-1 text-sm font-semibold text-accent">
                                    Compressed and saved {formatFileSize(uploadedDocument.compressionSavedBytes)}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-slate-400">
                                Uploaded at {new Date(uploadedDocument.uploadedAt).toLocaleString()}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemove(requirement.key, uploadedDocument)}
                            className="rounded-lg border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error hover:text-white"
                        >
                            Remove
                        </button>
                    </div>

                    {uploadedDocument.type.startsWith('image/') && (
                        <img
                            src={uploadedDocument.previewUrl}
                            alt={`${requirement.title} preview`}
                            className="mt-4 max-h-56 rounded-xl border border-slate-200 object-contain"
                        />
                    )}

                    {uploadedDocument.type === 'application/pdf' && (
                        <a
                            href={uploadedDocument.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm font-semibold text-accent underline"
                        >
                            Open PDF preview
                        </a>
                    )}
                </div>
            )}

            <ErrorMessage
                id={`${requirement.key}-upload-error`}
                message={uploadError || error}
            />
        </div>
    );
}

function Step7DocumentsSignature({
    formId,
    defaultValues = {},
    onSubmit,
}) {
    const signatureRef = useRef(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step7Schema),
        defaultValues: {
            ...defaultStep7Values,
            ...defaultValues,
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const watchedDocuments = {
        identityProof: watch('identityProof'),
        addressProof: watch('addressProof'),
        incomeProof: watch('incomeProof'),
        bankStatement: watch('bankStatement'),
    };

    const signatureDataUrl = watch('signatureDataUrl');

    useEffect(() => {
        return () => {
            Object.values(watchedDocuments).forEach((documents) => {
                documents.forEach((documentRecord) => {
                    revokePreviewUrl(documentRecord);
                });
            });
        };
    }, []);

    const handleDocumentUpload = (fieldName, documentRecord) => {
        const existingDocuments = watch(fieldName) || [];

        existingDocuments.forEach((existingDocument) => {
            revokePreviewUrl(existingDocument);
        });

        setValue(fieldName, [documentRecord], {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleDocumentRemove = (fieldName, documentRecord) => {
        revokePreviewUrl(documentRecord);

        setValue(fieldName, [], {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleSignatureEnd = () => {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
            setValue('signatureDataUrl', '', {
                shouldValidate: true,
                shouldDirty: true,
            });

            return;
        }

        setValue('signatureDataUrl', signatureRef.current.toDataURL('image/png'), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const clearSignature = () => {
        signatureRef.current?.clear();

        setValue('signatureDataUrl', '', {
            shouldValidate: true,
            shouldDirty: true,
        });
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
                    Documents & E-signature
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Upload required documents and draw your e-signature before continuing
                    to the final review step.
                </p>
            </div>

            <div className="grid gap-5">
                {DOCUMENT_REQUIREMENTS.map((requirement) => (
                    <DocumentUploadCard
                        key={requirement.key}
                        requirement={requirement}
                        documents={watchedDocuments[requirement.key] || []}
                        error={errors[requirement.key]?.message}
                        onUpload={handleDocumentUpload}
                        onRemove={handleDocumentRemove}
                    />
                ))}
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 p-4">
                <div>
                    <h4 className="font-bold text-slate-900">
                        E-signature
                        <span className="ml-1 text-error">*</span>
                    </h4>

                    <p className="mt-1 text-sm text-slate-600">
                        Draw your signature inside the box below.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-300 bg-white">
                    <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                            className: 'h-44 w-full rounded-xl',
                            'aria-label': 'Signature canvas',
                        }}
                        onEnd={handleSignatureEnd}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Clear signature
                    </button>

                    {signatureDataUrl && (
                        <p className="text-sm font-semibold text-accent">
                            ✓ Signature captured
                        </p>
                    )}
                </div>

                <ErrorMessage
                    id="signatureDataUrl-error"
                    message={errors.signatureDataUrl?.message}
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Checkbox
                    label={SIGNATURE_DECLARATION}
                    error={errors.documentConsent?.message}
                    {...register('documentConsent')}
                />
            </div>
        </form>
    );
}

export default Step7DocumentsSignature;