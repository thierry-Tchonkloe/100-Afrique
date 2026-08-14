// src/components/recruteur/offres/OffreSkeleton.tsx
export default function OffreSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-100 px-5 py-4 h-24" />
      ))}
    </div>
  );
}
