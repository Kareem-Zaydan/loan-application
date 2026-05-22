function ErrorMessage({ id, message, className = '' }) {
    if (!message) {
        return null;
    }

    return (
        <p
            id={id}
            role="alert"
            aria-live="polite"
            className={`mt-2 text-sm font-medium text-error ${className}`}
        >
            {message}
        </p>
    );
}

export default ErrorMessage;