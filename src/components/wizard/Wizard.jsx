import { useState } from 'react';
import { steps } from '../../data/steps';
import Step1LoanType from '../steps/Step1LoanType';
import Step2PersonalInfo from '../steps/Step2PersonalInfo';
import Step3KYC from '../steps/Step3KYC';
import Step4Address from '../steps/Step4Address';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import StepSidebar from './StepSidebar';

function Wizard() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [applicationData, setApplicationData] = useState({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
    });

    const currentStep = steps[currentStepIndex];

    const goToNextStep = () => {
        setCurrentStepIndex((previousStepIndex) => {
            if (previousStepIndex === steps.length - 1) {
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

    const renderStepContent = () => {
        if (currentStep.id === 1) {
            return (
                <Step1LoanType
                    formId={currentStep.formId}
                    defaultValues={applicationData.step1}
                    onSubmit={saveStep1AndContinue}
                />
            );
        }

        if (currentStep.id === 2) {
            return (
                <Step2PersonalInfo
                    formId={currentStep.formId}
                    defaultValues={applicationData.step2}
                    onSubmit={saveStep2AndContinue}
                />
            );
        }

        if (currentStep.id === 3) {
            return (
                <Step3KYC
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
                    formId={currentStep.formId}
                    defaultValues={applicationData.step4}
                    onSubmit={saveStep4AndContinue}
                />
            );
        }

        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-lg font-semibold text-slate-800">
                    {currentStep.title} fields will be built here.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    This step is still a placeholder. We will replace it with real fields
                    in the next phases.
                </p>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
                        LendSwift Loan Application
                    </p>

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Multi-Step Loan Application Form
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                        Complete your loan application step by step. Your progress will
                        later be saved automatically so you can resume the application.
                    </p>
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
    );
}

export default Wizard;