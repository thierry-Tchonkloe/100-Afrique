// src/components/emploi/job-detail/JobDetailSkeleton.tsx
export default function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-100 rounded-full w-14" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <div className="h-12 bg-[#E8622A]/20 rounded-xl w-full" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
