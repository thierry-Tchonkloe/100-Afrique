// src/components/emploi/metiers/SectorJobSkeleton.tsx
export default function SectorJobSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 bg-gray-100 rounded-full w-12" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
