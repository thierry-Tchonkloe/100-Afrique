// src/components/recruteur/candidatures/ListSkeleton.tsx
export default function ListSkeleton() {
  return (
    <div className="divide-y divide-gray-100 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3.5">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
            <div className="h-2 bg-gray-100 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
