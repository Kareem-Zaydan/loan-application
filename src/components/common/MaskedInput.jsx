import { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

const MaskedInput = forwardRef(function MaskedInput(
    {
        id,
        name,
        label,
        error,
        helpText,
        required = false,
        className = '',
        transformValue,
        ...props
    },
    ref,
) {
    const inputId = id || name;
    const errorId = error ? `${inputId}-error` : undefined;

    const handleChange = (event) => {
        if (transformValue) {
            event.target.value = transformValue(event.target.value);
        }

        props.onChange?.(event);
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
                        <span
                            className="ml-1 text-error"
                            aria-label="required"
                        >
                            *
                        </span>
                    )}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                name={name}
                type="text"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={errorId}
                onChange={handleChange}
                className={`min-h-11 w-full rounded-xl border bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                    error
                        ? 'border-error'
                        : 'border-slate-300'
                }`}
                {...props}
            />

            {helpText && (
                <p className="text-sm text-slate-500">
                    {helpText}
                </p>
            )}

            <ErrorMessage
                id={errorId}
                message={error}
            />
        </div>
    );
});

export default MaskedInput;