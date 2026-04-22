// src/components/alertes/AlertesSkeleton.tsx
export default function AlertesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-48 bg-gray-100 rounded-full" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-xl" />
              <div className="w-8 h-8 bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-6 w-16 bg-gray-100 rounded-full" />
            ))}
          </div>
          <div className="h-3 w-40 bg-gray-100 rounded-full mt-3" />
        </div>
      ))}
    </div>
  );
}