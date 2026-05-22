import { forwardRef, useEffect, useState } from 'react';
import ErrorMessage from './ErrorMessage';

function formatIndianCurrency(value) {
    const numericValue = String(value || '').replace(/\D/g, '');

    if (!numericValue) {
        return '';
    }

    return Number(numericValue).toLocaleString('en-IN');
}

const CurrencyInput = forwardRef(function CurrencyInput(
    {
        id,
        name,
        label,
        value,
        defaultValue = '',
        onChange,
        onValueChange,
        error,
        helpText,
        required = false,
        className = '',
        ...props
    },
    ref,
) {
    const inputId = id || name;
    const errorId = error ? `${inputId}-error` : undefined;
    const [displayValue, setDisplayValue] = useState(formatIndianCurrency(defaultValue));

    useEffect(() => {
        if (value !== undefined) {
            setDisplayValue(formatIndianCurrency(value));
        }
    }, [value]);

    const handleChange = (event) => {
        const numericValue = event.target.value.replace(/\D/g, '');
        const formattedValue = formatIndianCurrency(numericValue);

        setDisplayValue(formattedValue);
        onValueChange?.(numericValue);

        onChange?.({
            ...event,
            target: {
                ...event.target,
                name,
                value: numericValue,
            },
        });
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
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

            <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                </span>

                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleChange}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={errorId}
                    className={`min-h-11 w-full rounded-xl border bg-white py-2 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? 'border-error' : 'border-slate-300'
                        }`}
                    {...props}
                />
            </div>

            {helpText && (
                <p className="text-sm text-slate-500">
                    {helpText}
                </p>
            )}

            <ErrorMessage id={errorId} message={error} />
        </div>
    );
});

export { formatIndianCurrency };
export default CurrencyInput;