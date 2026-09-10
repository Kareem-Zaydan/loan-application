import { useState } from 'react';
import { steps } from '../../data/steps';
import useEncryptedAutoSave from '../../hooks/useEncryptedAutoSave';
import Step1LoanType from '../steps/Step1LoanType';
import Step2PersonalInfo from '../steps/Step2PersonalInfo';
import Step3KYC from '../steps/Step3KYC';
import Step4Address from '../steps/Step4Address';
import Step5Employment from '../steps/Step5Employment';
import Step6CoApplicant from '../steps/Step6CoApplicant';
import Step7DocumentsSignature from '../steps/Step7DocumentsSignature';
import Step8ReviewSubmit from '../steps/Step8ReviewSubmit';
import AutoSaveStatus from './AutoSaveStatus';
import ProgressBar from './ProgressBar';
import ResumeDraftModal from './ResumeDraftModal';
import StepNavigation from './StepNavigation';
import StepSidebar from './StepSidebar';

const initialApplicationData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
    step7: {},
    step8: {},
};

function hasApplicationStarted(applicationData) {
    return Object.values(applicationData).some(
        (stepData) => Object.keys(stepData || {}).length > 0,
    );
}

function Wizard() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState('');
    const [hasResolvedDraftChoice, setHasResolvedDraftChoice] =
        useState(false);
    const [isLoadingDraft, setIsLoadingDraft] = useState(false);
    const [draftRestoreKey, setDraftRestoreKey] = useState(0);

    const [applicationData, setApplicationData] = useState(
        initialApplicationData,
    );

    const applicationStarted =
        hasApplicationStarted(applicationData);

    const {
        hasDraft,
        hasCheckedForDraft,
        lastSavedAt,
        isSaving,
        autoSaveError,
        loadDraft,
        clearDraft,
    } = useEncryptedAutoSave(
        applicationData,
        currentStepIndex,
        {
            enabled:
                hasResolvedDraftChoice
                && !isSubmitted
                && applicationStarted,
        },
    );

    const draftChoiceResolved =
        hasResolvedDraftChoice
        || (hasCheckedForDraft && !hasDraft);

    const currentStep = steps[currentStepIndex];

    const handleResumeDraft = async () => {
        try {
            setIsLoadingDraft(true);

            const draft = await loadDraft();

            if (draft?.applicationData) {
                setApplicationData({
                    ...initialApplicationData,
                    ...draft.applicationData,
                });

                setCurrentStepIndex(
                    typeof draft.currentStepIndex === 'number'
                        ? draft.currentStepIndex
                        : 0,
                );

                setDraftRestoreKey(
                    (previousKey) => previousKey + 1,
                );
            }

            setHasResolvedDraftChoice(true);
        } finally {
            setIsLoadingDraft(false);
        }
    };

    const handleStartFresh = () => {
        clearDraft();

        setApplicationData({
            ...initialApplicationData,
        });

        setCurrentStepIndex(0);

        setDraftRestoreKey(
            (previousKey) => previousKey + 1,
        );

        setHasResolvedDraftChoice(true);
    };

    const goToNextStep = () => {
        setCurrentStepIndex((previousStepIndex) => {
            if (
                previousStepIndex
                === steps.length - 1
            ) {
                return previousStepIndex;
            }

            return previousStepIndex + 1;
        });
    };

    const goToPreviousStep = () => {
        setCurrentStepIndex((previousStepIndex) => {
            if (previousStepIndex === 0) {
                return previousStepIndex;
            }

            return previousStepIndex - 1;
        });
    };

    const goToStep = (stepIndex) => {
        setCurrentStepIndex(stepIndex);
    };

    const saveStep1AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step1: stepData,
        }));

        goToNextStep();
    };

    const saveStep2AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step2: stepData,
        }));

        goToNextStep();
    };

    const saveStep3AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step3: stepData,
        }));

        goToNextStep();
    };

    const saveStep4AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step4: stepData,
        }));

        goToNextStep();
    };

    const saveStep5AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step5: stepData,
        }));

        goToNextStep();
    };

    const saveStep6AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step6: stepData,
        }));

        goToNextStep();
    };

    const saveStep7AndContinue = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step7: stepData,
        }));

        goToNextStep();
    };

    const saveStep8AndSubmit = (stepData) => {
        setApplicationData((previousData) => ({
            ...previousData,
            step8: stepData,
        }));

        const generatedApplicationId =
            `LS-${Date.now().toString().slice(-8)}`;

        setApplicationId(generatedApplicationId);

        clearDraft();

        setIsSubmitted(true);
    };

    const renderStepContent = () => {
        if (currentStep.id === 1) {
            return (
                <Step1LoanType
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step1}
                    onSubmit={saveStep1AndContinue}
                />
            );
        }

        if (currentStep.id === 2) {
            return (
                <Step2PersonalInfo
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step2}
                    onSubmit={saveStep2AndContinue}
                />
            );
        }

        if (currentStep.id === 3) {
            return (
                <Step3KYC
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step3}
                    loanType={applicationData.step1.loanType}
                    loanAmount={applicationData.step1.loanAmount}
                    onSubmit={saveStep3AndContinue}
                />
            );
        }

        if (currentStep.id === 4) {
            return (
                <Step4Address
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step4}
                    onSubmit={saveStep4AndContinue}
                />
            );
        }

        if (currentStep.id === 5) {
            return (
                <Step5Employment
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step5}
                    loanType={applicationData.step1.loanType}
                    onSubmit={saveStep5AndContinue}
                />
            );
        }

        if (currentStep.id === 6) {
            return (
                <Step6CoApplicant
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step6}
                    onSubmit={saveStep6AndContinue}
                />
            );
        }

        if (currentStep.id === 7) {
            return (
                <Step7DocumentsSignature
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step7}
                    onSubmit={saveStep7AndContinue}
                />
            );
        }

        if (currentStep.id === 8) {
            return (
                <Step8ReviewSubmit
                    key={draftRestoreKey}
                    formId={currentStep.formId}
                    defaultValues={applicationData.step8}
                    applicationData={applicationData}
                    onSubmit={saveStep8AndSubmit}
                />
            );
        }

        return null;
    };

    if (isSubmitted) {
        return (
            <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
                        ✓
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-slate-900">
                        Application Submitted Successfully
                    </h1>

                    <p className="mt-3 text-slate-600">
                        Your multi-step loan application has
                        been submitted for processing. A
                        confirmation summary has been generated
                        in the application state.
                    </p>

                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                        Demo Application ID: {applicationId}
                    </p>
                </section>
            </main>
        );
    }

    return (
        <>
            {hasCheckedForDraft
                && hasDraft
                && !draftChoiceResolved
                && (
                    <ResumeDraftModal
                        isLoading={isLoadingDraft}
                        onResume={handleResumeDraft}
                        onStartFresh={handleStartFresh}
                    />
                )}

            <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-5xl">
                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
                                    LendSwift Loan Application
                                </p>

                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Multi-Step Loan Application Form
                                </h1>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                                    Complete your loan application
                                    step by step. Your progress is
                                    encrypted and saved automatically
                                    in this browser.
                                </p>
                            </div>

                            <AutoSaveStatus
                                isSaving={isSaving}
                                lastSavedAt={lastSavedAt}
                                error={autoSaveError}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        <aside className="rounded-2xl bg-white p-5 shadow-sm">
                            <ProgressBar
                                currentStepIndex={currentStepIndex}
                                totalSteps={steps.length}
                            />

                            <StepSidebar
                                steps={steps}
                                currentStepIndex={currentStepIndex}
                                onStepChange={goToStep}
                            />
                        </aside>

                        <section className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-6 border-b border-slate-200 pb-5">
                                <p className="mb-2 text-sm font-semibold text-primary">
                                    Step {currentStep.id}
                                </p>

                                <h2 className="text-2xl font-bold text-slate-900">
                                    {currentStep.title}
                                </h2>

                                <p className="mt-2 text-slate-600">
                                    {currentStep.description}
                                </p>
                            </div>

                            {renderStepContent()}

                            <StepNavigation
                                currentStepIndex={currentStepIndex}
                                totalSteps={steps.length}
                                onPrevious={goToPreviousStep}
                                onNext={goToNextStep}
                                nextFormId={currentStep.formId}
                            />
                        </section>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Wizard;