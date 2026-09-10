function StepNavigation({
    currentStepIndex,
    totalSteps,
    onPrevious,
    onNext,
    nextFormId,
}) {
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;

    const nextButtonLabel = isLastStep
        ? 'Submit Application'
        : 'Next';

    const shouldSubmitForm = Boolean(nextFormId);

    return (
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Previous
            </button>

            {shouldSubmitForm ? (
                <button
                    type="submit"
                    form={nextFormId}
                    className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                    {nextButtonLabel}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isLastStep}
                    className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {nextButtonLabel}
                </button>
            )}
        </div>
    );
}

export default StepNavigation;