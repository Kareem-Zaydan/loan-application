function StepNavigation({
    currentStepIndex,
    totalSteps,
    onPrevious,
    onNext,
}) {
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;

    return (
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="min-h-11 rounded-xl border border-slate-300 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Previous
            </button>

            <button
                type="button"
                className="min-h-11 rounded-xl border border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
                Save Draft
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={isLastStep}
                className="min-h-11 rounded-xl bg-primary px-5 py-2 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default StepNavigation;