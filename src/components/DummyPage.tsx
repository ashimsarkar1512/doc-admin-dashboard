
export default function DummyPage({ title }: { title: string }) {
  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your {title.toLowerCase()} and view reports
        </p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          {title} Content
        </h3>
        <p className="text-sm text-slate-400 text-center max-w-md">
          This is a placeholder page for the {title} module. Real-time metrics, configurations, and actions will be displayed here once connected to the API.
        </p>
      </div>
    </div>
  );
}
