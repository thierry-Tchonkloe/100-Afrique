const ads = [
    { name: "Top Banner",        company: "Air France",   status: "Actif",  active: true },
    { name: "Sidebar Skyscraper",company: "Booking.com",  status: "Expiré", active: false },
    { name: "Article Banner",    company: "Emirates",      status: "Actif",  active: true },
];

const contacts = [
    { label: "Agences de voyage",   count: 12 },
    { label: "Compagnies aériennes",count: 7  },
    { label: "Offices de tourisme", count: 4  },
];

export default function AdminMonetisation() {
    return (
        <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Administration et Monétisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Statut des Publicités */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700">Statut des Publicités</h3>
                <ul className="space-y-3">
                {ads.map((ad, i) => (
                    <li key={i} className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-800">{ad.name}</p>
                        <p className="text-xs text-gray-400">{ad.company}</p>
                    </div>
                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ad.active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                    >
                        {ad.status}
                    </span>
                    </li>
                ))}
                </ul>
                <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
                    Gérer les Espaces Publicitaires
                </button>
            </div>

            {/* Statistiques de Contact */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700">Statistiques de Contact</h3>
                <div className="text-center">
                <p className="text-5xl font-bold text-[#F59E0B]">23</p>
                <p className="text-xs text-gray-400 mt-1">Demandes Kit Média cette semaine</p>
                </div>
                <ul className="space-y-2">
                {contacts.map((c, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-semibold text-gray-800">{c.count}</span>
                    </li>
                ))}
                </ul>
                <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
                Gérer les Leads Partenaires
                </button>
            </div>

            </div>
        </div>
    );
}