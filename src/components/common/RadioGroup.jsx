import ErrorMessage from './ErrorMessage';

function RadioGroup({
    name,
    legend,
    options = [],
    value,
    defaultValue,
    onChange,
    error,
    helpText,
    required = false,
    className = '',
    direction = 'vertical',
}) {
    const errorId = error ? `${name}-error` : undefined;
    const isControlled = value !== undefined;

    return (
        <fieldset
            className={`space-y-3 ${className}`}
            aria-describedby={errorId}
        >
            {legend && (
                <legend className="text-sm font-semibold text-slate-800">
                    {legend}
                    {required && (
                        <span className="ml-1 text-error" aria-label="required">
                            *
                        </span>
                    )}
                </legend>
            )}

            {helpText && (
                <p className="text-sm text-slate-500">
                    {helpText}
                </p>
            )}

            <div
                className={
                    direction === 'horizontal'
                        ? 'flex flex-wrap gap-3'
                        : 'space-y-3'
                }
            >
                {options.map((option) => {
                    const optionId = `${name}-${option.value}`;

                    const checkedProps = isControlled
                        ? {
                            checked: value === option.value,
                            onChange: () => onChange?.(option.value),
                        }
                        : {
                            defaultChecked: defaultValue === option.value,
                            onChange: () => onChange?.(option.value),
                        };

                    return (
                        <label
                            key={option.value}
                            htmlFor={optionId}
                            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-primary/5"
                        >
                            <input
                                id={optionId}
                                name={name}
                                type="radio"
                                value={option.value}
                                className="h-4 w-4 border-slate-300 text-primary focus:ring-primary"
                                {...checkedProps}
                            />

                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>

            <ErrorMessage id={errorId} message={error} />
        </fieldset>
    );
}

export default RadioGroup;