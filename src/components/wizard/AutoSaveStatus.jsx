function AutoSaveStatus({
    isSaving,
    lastSavedAt,
    error,
}) {
    if (error) {
        return (
            <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                {error}
            </div>
        );
    }

    if (isSaving) {
        return (
            <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning">
                Saving draft...
            </div>
        );
    }

    if (lastSavedAt) {
        return (
            <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">
                Draft saved automatically at {new Date(lastSavedAt).toLocaleTimeString()}
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            Auto-save is active.
        </div>
    );
}

export default AutoSaveStatus;