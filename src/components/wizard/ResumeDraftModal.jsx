function ResumeDraftModal({
    isLoading,
    onResume,
    onStartFresh,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-draft-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
                    ↺
                </div>

                <h2
                    id="resume-draft-title"
                    className="mt-5 text-center text-2xl font-bold text-slate-900"
                >
                    Resume saved application?
                </h2>

                <p className="mt-3 text-center text-sm leading-6 text-slate-600">
                    We found an encrypted saved draft in this browser. You can resume it
                    or start a fresh application.
                </p>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    Document previews and signature may need to be uploaded or drawn again
                    after restoring, because browser preview URLs cannot be safely saved.
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={onStartFresh}
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Start Fresh
                    </button>

                    <button
                        type="button"
                        onClick={onResume}
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {isLoading ? 'Loading...' : 'Resume Draft'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResumeDraftModal;