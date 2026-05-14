function ProgressBar({ currentStepIndex, totalSteps }) {
    const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

    return (
        <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>
                    Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span>{progressPercentage}%</span>
            </div>

            <div
                className="h-3 overflow-hidden rounded-full bg-slate-200"
                aria-label={`Application progress ${progressPercentage}%`}
            >
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;