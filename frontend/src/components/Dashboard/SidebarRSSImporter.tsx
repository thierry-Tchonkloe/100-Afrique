// // src/components/Dashboard/SidebarRSSImporter.tsx
// "use client";
 
// import { useState } from "react";
// import { Rss, Download, Loader2, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
// import Link from "next/link";
 
// interface RSSourceResult {
//   name: string;
//   status: string;
//   imported: number;
//   skipped: number;
//   errors: number;
//   message: string;
//   source?: string;
// }
 
// interface RSSImportResult {
//   imported: number;
//   skipped: number;
//   errors: number;
//   sources: RSSourceResult[];
//   totalProcessed: number;
// }
 
// export default function SidebarRSSImporter({ isOpen }: { isOpen: boolean }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<RSSImportResult | null>(null);
//   const [showDetails, setShowDetails] = useState(false);
 
//   const handleQuickImport = async () => {
//     setIsLoading(true);
//     setResult(null);
 
//     try {
//       const response = await fetch('/api/magazines/rss/import', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       setResult(data);
//     } catch (error: any) {
//       console.error('Erreur import RSS:', error);
//       setResult({
//         imported: 0,
//         skipped: 0,
//         errors: 1,
//         sources: [],
//         totalProcessed: 0
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'success':
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'partial':
//         return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//       case 'error':
//         return <XCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-gray-500" />;
//     }
//   };
 
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'success':
//         return 'text-green-600 bg-green-50 border-green-200';
//       case 'partial':
//         return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       case 'error':
//         return 'text-red-600 bg-red-50 border-red-200';
//       default:
//         return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };
 
//   if (!isOpen) {
//     return (
//       <div className="px-4 py-3">
//         <Link
//           href="/rss-import"
//           className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors"
//           title="Importer RSS"
//         >
//           <Rss className="w-4 h-4" />
//         </Link>
//       </div>
//     );
//   }
 
//   return (
//     <div className="px-3 py-4 border-t border-gray-700">
//       {/* Bouton principal vers page détaillée */}
//       <Link
//         href="/rss-import"
//         className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors font-medium text-sm mb-3"
//       >
//         <Rss className="w-4 h-4" />
//         Import RSS Détaillé
//       </Link>
 
//       {/* Bouton quick import */}
//       <button
//         onClick={handleQuickImport}
//         disabled={isLoading}
//         className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="w-3 h-3 animate-spin" />
//             Quick...
//           </>
//         ) : (
//           <>
//             <Download className="w-3 h-3" />
//             Import Rapide
//           </>
//         )}
//       </button>
 
//       {/* Résultats du quick import */}
//       {result && (
//         <div className="mt-3 space-y-2">
//           {/* Résumé global */}
//           <div className="bg-gray-800 rounded-lg p-2">
//             <div className="grid grid-cols-3 gap-1 text-center">
//               <div>
//                 <div className="text-green-400 font-bold text-sm">{result.imported}</div>
//                 <div className="text-xs text-gray-400">✓</div>
//               </div>
//               <div>
//                 <div className="text-yellow-400 font-bold text-sm">{result.skipped}</div>
//                 <div className="text-xs text-gray-400">⏭</div>
//               </div>
//               <div>
//                 <div className="text-red-400 font-bold text-sm">{result.errors}</div>
//                 <div className="text-xs text-gray-400">✗</div>
//               </div>
//             </div>
//           </div>
 
//           {/* Lien vers détails */}
//           <Link
//             href="/rss-import"
//             className="text-xs text-orange-400 hover:text-orange-300 text-center block"
//           >
//             Voir les détails →
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }



// src/components/Dashboard/SidebarRSSImporter.tsx
"use client";
 
import { useState } from "react";
import api from "@/lib/api";
import { Rss, Download, Loader2, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
 
interface RSSourceResult {
  name: string;
  status: string;
  imported: number;
  skipped: number;
  errors: number;
  message: string;
  source?: string;
}
 
interface RSSImportResult {
  imported: number;
  skipped: number;
  errors: number;
  sources: RSSourceResult[];
  totalProcessed: number;
}
 
export default function SidebarRSSImporter({ isOpen }: { isOpen: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RSSImportResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
 
  const handleQuickImport = async () => {
    setIsLoading(true);
    setResult(null);
 
    try {
      const response = await api.post("/admin/scraper/import");
      setResult(response.data);
    } catch (error: any) {
      console.error('Erreur import RSS:', error);
      setResult({
        imported: 0,
        skipped: 0,
        errors: 1,
        sources: [],
        totalProcessed: 0
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
 
  if (!isOpen) {
    return (
      <div className="px-4 py-3">
        <Link
          href="/rss-import"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors"
          title="Importer RSS"
        >
          <Rss className="w-4 h-4" />
        </Link>
      </div>
    );
  }
 
  return (
    <div className="px-3 py-4 border-t border-gray-700">
      {/* Bouton principal vers page détaillée */}
      <Link
        href="/rss-import"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors font-medium text-sm mb-3"
      >
        <Rss className="w-4 h-4" />
        Import RSS Détaillé
      </Link>
 
      {/* Bouton quick import */}
      <button
        onClick={handleQuickImport}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Quick...
          </>
        ) : (
          <>
            <Download className="w-3 h-3" />
            Import Rapide
          </>
        )}
      </button>
 
      {/* Résultats du quick import */}
      {result && (
        <div className="mt-3 space-y-2">
          {/* Résumé global */}
          <div className="bg-gray-800 rounded-lg p-2">
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <div className="text-green-400 font-bold text-sm">{result.imported}</div>
                <div className="text-xs text-gray-400">✓</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold text-sm">{result.skipped}</div>
                <div className="text-xs text-gray-400">⏭</div>
              </div>
              <div>
                <div className="text-red-400 font-bold text-sm">{result.errors}</div>
                <div className="text-xs text-gray-400">✗</div>
              </div>
            </div>
          </div>
 
          {/* Lien vers détails */}
          <Link
            href="/rss-import"
            className="text-xs text-orange-400 hover:text-orange-300 text-center block"
          >
            Voir les détails →
          </Link>
        </div>
      )}
    </div>
  );
}