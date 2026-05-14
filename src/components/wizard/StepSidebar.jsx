function StepSidebar({ steps, currentStepIndex, onStepChange }) {
    return (
        <nav aria-label="Loan application steps">
            <ol className="space-y-2">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    let stepButtonClass =
                        'bg-slate-50 text-slate-700 hover:bg-slate-100';

                    let stepNumberClass =
                        'bg-slate-200 text-slate-700';

                    if (isActive) {
                        stepButtonClass = 'bg-primary text-white';
                        stepNumberClass = 'bg-white text-primary';
                    } else if (isCompleted) {
                        stepNumberClass = 'bg-accent text-white';
                    }

                    return (
                        <li key={step.id}>
                            <button
                                type="button"
                                onClick={() => onStepChange(index)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${stepButtonClass}`}
                            >
                                <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stepNumberClass}`}
                                >
                                    {isCompleted ? '✓' : step.id}
                                </span>

                                <span className="font-medium">{step.title}</span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default StepSidebar;