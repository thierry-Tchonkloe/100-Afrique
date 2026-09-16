// src/components/emploi/conseils/ArticleSkeleton.tsx
export default function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
          <div className="space-y-1">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-2 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
