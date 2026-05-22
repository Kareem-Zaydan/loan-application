import { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

function InputRoot({ children, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {children}
        </div>
    );
}

function InputLabel({
    htmlFor,
    children,
    required = false,
    className = '',
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-semibold text-slate-800 ${className}`}
        >
            {children}
            {required && (
                <span className="ml-1 text-error" aria-label="required">
                    *
                </span>
            )}
        </label>
    );
}

const InputField = forwardRef(function InputField(
    {
        id,
        name,
        type = 'text',
        error,
        className = '',
        ...props
    },
    ref,
) {
    const inputId = id || name;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
        <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            className={`min-h-11 w-full rounded-xl border bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? 'border-error' : 'border-slate-300'
                } ${className}`}
            {...props}
        />
    );
});

function InputHelpText({ children, className = '' }) {
    if (!children) {
        return null;
    }

    return (
        <p className={`text-sm text-slate-500 ${className}`}>
            {children}
        </p>
    );
}

function InputError({ id, message }) {
    return <ErrorMessage id={id} message={message} />;
}

const Input = Object.assign(InputRoot, {
    Label: InputLabel,
    Field: InputField,
    HelpText: InputHelpText,
    Error: InputError,
});

export default Input;