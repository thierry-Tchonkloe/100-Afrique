import { AlertTriangle } from "lucide-react";

const tasks = [
    { value: "12",   label: "Articles en Brouillon",  color: "text-[#F59E0B]" },
    { value: "5",    label: "Soumissions à Réviser",   color: "text-[#F59E0B]" },
    { value: "J-45", label: "ITB Berlin 2024",          color: "text-blue-500"   },
    { value: "2",    label: "Espaces Pub Expirés",      color: "text-[#F59E0B]" },
];

export default function TasksFlow() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {tasks.map((t, i) => (
                <div key={i} className="text-center">
                    <p className={`text-3xl font-bold ${t.color}`}>{t.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.label}</p>
                </div>
                ))}
            </div>
            <div className="flex justify-center">
                <button className="bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
                Voir toutes les Tâches
                </button>
            </div>
        </div>
    );
}