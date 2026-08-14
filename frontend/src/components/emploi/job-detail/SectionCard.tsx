// src/components/emploi/job-detail/SectionCard.tsx
export default function SectionCard({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A]">
          {icon}
        </div>
        <h2 className="font-bold text-[#1E2A3A] text-base">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
