// src/components/emploi/home/HomeSkeletons.tsx
export function CompanySkeleton() {
  return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
}

export function JobSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-100 rounded-full w-10" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
