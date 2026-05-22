import { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

const Checkbox = forwardRef(function Checkbox(
    {
        id,
        name,
        label,
        error,
        helpText,
        className = '',
        ...props
    },
    ref,
) {
    const checkboxId = id || name;
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-start gap-3">
                <input
                    ref={ref}
                    id={checkboxId}
                    name={name}
                    type="checkbox"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={errorId}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-primary outline-none focus:ring-4 focus:ring-primary/10"
                    {...props}
                />

                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-6 text-slate-700"
                    >
                        {label}
                    </label>
                )}
            </div>

            {helpText && (
                <p className="pl-8 text-sm text-slate-500">
                    {helpText}
                </p>
            )}

            <div className="pl-8">
                <ErrorMessage id={errorId} message={error} />
            </div>
        </div>
    );
});

export default Checkbox;