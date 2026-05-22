import { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

const Select = forwardRef(function Select(
    {
        id,
        name,
        label,
        options = [],
        placeholder = 'Select an option',
        error,
        helpText,
        required = false,
        className = '',
        ...props
    },
    ref,
) {
    const selectId = id || name;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-semibold text-slate-800"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-error" aria-label="required">
                            *
                        </span>
                    )}
                </label>
            )}

            <select
                ref={ref}
                id={selectId}
                name={name}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={errorId}
                className={`min-h-11 w-full rounded-xl border bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? 'border-error' : 'border-slate-300'
                    }`}
                {...props}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {helpText && (
                <p className="text-sm text-slate-500">
                    {helpText}
                </p>
            )}

            <ErrorMessage id={errorId} message={error} />
        </div>
    );
});

export default Select;