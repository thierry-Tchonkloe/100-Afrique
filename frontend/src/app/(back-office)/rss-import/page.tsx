// // src/app/(back-office)/rss-import/page.tsx
// 'use client';
 
// import { useState, useEffect } from 'react';
// import {
//     Rss,
//     Download,
//     Loader2,
//     CheckCircle,
//     AlertCircle,
//     XCircle,
//     RefreshCw,
//     Clock,
//     TrendingUp,
//     FileText,
//     AlertTriangle,
//     ArrowLeft
// } from 'lucide-react';
// import Link from 'next/link';
// import api from '@/lib/api';
 
// interface RSSourceResult {
//   name: string;
//   status: string;
//   imported: number;
//   skipped: number;
//   errors: number;
//   message: string;
//   source?: string;
//   lastSync?: string;
//   totalArticles?: number;
// }
 
// interface RSSImportResult {
//   imported: number;
//   skipped: number;
//   errors: number;
//   sources: RSSourceResult[];
//   totalProcessed: number;
//   startTime?: string;
//   endTime?: string;
//   duration?: number;
// }
 
// export default function RSSImportPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<RSSImportResult | null>(null);
//   const [history, setHistory] = useState<RSSImportResult[]>([]);
//   const [showDetails, setShowDetails] = useState(true);
 
//   useEffect(() => {
//     // Charger l'historique des imports au chargement de la page
//     fetchImportHistory();
//   }, []);
 
//   const fetchImportHistory = async () => {
//     try {
//       // API pour récupérer l'historique (à implémenter côté backend)
//       // const response = await api.get('/magazines/rss/history');
//       // setHistory(response.data);
//     } catch (error) {
//       console.error('Erreur chargement historique:', error);
//     }
//   };
 
//   const handleImportRSS = async () => {
//     setIsLoading(true);
//     setResult(null);
 
//     const startTime = new Date().toISOString();
 
//     try {
//       const response = await api.post('/admin/magazines/rss/import');
//       const endTime = new Date().toISOString();
//       const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
 
//       setResult({
//         ...response.data,
//         startTime,
//         endTime,
//         duration
//       });
 
//       // Ajouter à l'historique
//       const newHistory = {
//         ...response.data,
//         startTime,
//         endTime,
//         duration
//       };
//       setHistory(prev => [newHistory, ...prev.slice(0, 9)]); // Garder 10 derniers
//     } catch (error: any) {
//       console.error('Erreur import RSS:', error);
//       const endTime = new Date().toISOString();
//       const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
 
//       setResult({
//         imported: 0,
//         skipped: 0,
//         errors: 1,
//         sources: [],
//         totalProcessed: 0,
//         startTime,
//         endTime,
//         duration
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'partial':
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />;
//       case 'error':
//         return <XCircle className="w-5 h-5 text-red-500" />;
//       default:
//         return <AlertCircle className="w-5 h-5 text-gray-500" />;
//     }
//   };
 
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'success':
//         return 'border-green-200 bg-green-50 text-green-800';
//       case 'partial':
//         return 'border-yellow-200 bg-yellow-50 text-yellow-800';
//       case 'error':
//         return 'border-red-200 bg-red-50 text-red-800';
//       default:
//         return 'border-gray-200 bg-gray-50 text-gray-800';
//     }
//   };
 
//   const formatDuration = (ms: number) => {
//     if (ms < 1000) return `${ms}ms`;
//     return `${(ms / 1000).toFixed(1)}s`;
//   };
 
//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('fr-FR', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };
 
//   const getOverallStatus = () => {
//     if (!result) return 'pending';
//     if (result.errors > 0 && result.imported === 0) return 'error';
//     if (result.errors > 0) return 'partial';
//     return 'success';
//   };
 
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Retour au dashboard
//         </Link>
        
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <Rss className="w-8 h-8 text-orange-500" />
//               Import RSS
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Importez les articles depuis les flux RSS des sources tourisme africain
//             </p>
//           </div>
          
//           <button
//             onClick={handleImportRSS}
//             disabled={isLoading}
//             className="flex items-center gap-3 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Importation en cours...
//               </>
//             ) : (
//               <>
//                 <Download className="w-5 h-5" />
//                 Lancer l'importation
//               </>
//             )}
//           </button>
//         </div>
//       </div>
 
//       {/* Statistiques principales */}
//       {result && (
//         <div className="mb-8">
//           {/* Statut global */}
//           <div className={`rounded-xl border-2 p-6 mb-6 ${getStatusColor(getOverallStatus())}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {getStatusIcon(getOverallStatus())}
//                 <div>
//                   <h2 className="text-xl font-bold">
//                     {getOverallStatus() === 'success' && 'Importation réussie !'}
//                     {getOverallStatus() === 'partial' && 'Importation partielle'}
//                     {getOverallStatus() === 'error' && 'Importation échouée'}
//                     {getOverallStatus() === 'pending' && 'Importation en cours...'}
//                   </h2>
//                   <p className="text-sm opacity-75">
//                     {result.startTime && result.endTime && (
//                       <>Terminée à {formatTime(result.endTime)} ({formatDuration(result.duration || 0)})</>
//                     )}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex gap-6 text-center">
//                 <div>
//                   <div className="text-3xl font-bold text-green-600">{result.imported}</div>
//                   <div className="text-sm">Importés</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-yellow-600">{result.skipped}</div>
//                   <div className="text-sm">Ignorés</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-red-600">{result.errors}</div>
//                   <div className="text-sm">Erreurs</div>
//                 </div>
//               </div>
//             </div>
//           </div>
 
//           {/* Graphique simple */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white rounded-lg p-6 shadow-sm border">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">Taux de réussite</span>
//                 <TrendingUp className="w-4 h-4 text-green-500" />
//               </div>
//               <div className="text-2xl font-bold text-green-600">
//                 {result.totalProcessed > 0
//                   ? Math.round((result.imported / result.totalProcessed) * 100)
//                   : 0}%
//               </div>
//               <div className="text-xs text-gray-500">
//                 {result.imported} / {result.totalProcessed} articles
//               </div>
//             </div>
 
//             <div className="bg-white rounded-lg p-6 shadow-sm border">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">Sources traitées</span>
//                 <FileText className="w-4 h-4 text-blue-500" />
//               </div>
//               <div className="text-2xl font-bold text-blue-600">
//                 {result.sources.length}
//               </div>
//               <div className="text-xs text-gray-500">
//                 Sur 46 sources disponibles
//               </div>
//             </div>
 
//             <div className="bg-white rounded-lg p-6 shadow-sm border">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">Durée totale</span>
//                 <Clock className="w-4 h-4 text-purple-500" />
//               </div>
//               <div className="text-2xl font-bold text-purple-600">
//                 {formatDuration(result.duration || 0)}
//               </div>
//               <div className="text-xs text-gray-500">
//                 Temps de traitement
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* Détails par source */}
//       {result && result.sources.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm border">
//           <div className="p-6 border-b">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-900">Détails par source</h2>
//               <button
//                 onClick={() => setShowDetails(!showDetails)}
//                 className="text-sm text-gray-600 hover:text-gray-900"
//               >
//                 {showDetails ? 'Masquer' : 'Afficher'} les détails
//               </button>
//             </div>
//           </div>
 
//           {showDetails && (
//             <div className="divide-y">
//               {result.sources.map((source, index) => (
//                 <div key={index} className="p-6 hover:bg-gray-50">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       {getStatusIcon(source.status)}
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{source.name}</h3>
//                         <p className="text-sm text-gray-600">{source.message}</p>
//                       </div>
//                     </div>
                    
//                     <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(source.status)}`}>
//                       {source.status === 'success' && 'Succès'}
//                       {source.status === 'partial' && 'Partiel'}
//                       {source.status === 'error' && 'Erreur'}
//                     </div>
//                   </div>
 
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="bg-green-50 rounded-lg p-3">
//                       <div className="text-lg font-bold text-green-600">{source.imported}</div>
//                       <div className="text-xs text-green-700">Importés</div>
//                     </div>
//                     <div className="bg-yellow-50 rounded-lg p-3">
//                       <div className="text-lg font-bold text-yellow-600">{source.skipped}</div>
//                       <div className="text-xs text-yellow-700">Ignorés</div>
//                     </div>
//                     <div className="bg-red-50 rounded-lg p-3">
//                       <div className="text-lg font-bold text-red-600">{source.errors}</div>
//                       <div className="text-xs text-red-700">Erreurs</div>
//                     </div>
//                   </div>
 
//                   {source.errors > 0 && (
//                     <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <div className="flex items-center gap-2 text-red-800">
//                         <AlertTriangle className="w-4 h-4" />
//                         <span className="text-sm font-medium">Erreurs détectées</span>
//                       </div>
//                       <p className="text-sm text-red-700 mt-1">{source.message}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
 
//       {/* Historique des imports */}
//       {history.length > 0 && (
//         <div className="mt-8 bg-white rounded-xl shadow-sm border">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-bold text-gray-900">Historique des imports</h2>
//           </div>
//           <div className="divide-y">
//             {history.map((item, index) => (
//               <div key={index} className="p-4 hover:bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {getStatusIcon(getOverallStatus())}
//                     <div>
//                       <div className="font-medium">
//                         Import du {new Date(item.startTime || '').toLocaleDateString('fr-FR')}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         {item.imported} importés, {item.skipped} ignorés, {item.errors} erreurs
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {item.startTime && formatTime(item.startTime)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
 
//       {/* État initial */}
//       {!result && !isLoading && (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Prêt à importer les flux RSS
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Cliquez sur le bouton "Lancer l'importation" pour commencer à récupérer les articles
//             depuis les 46 sources RSS configurées.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <FileText className="w-5 h-5 text-blue-500" />
//               <div>
//                 <div className="font-medium text-sm">46 sources</div>
//                 <div className="text-xs text-gray-600">Magazines tourisme</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <RefreshCw className="w-5 h-5 text-green-500" />
//               <div>
//                 <div className="font-medium text-sm">Auto toutes les 6h</div>
//                 <div className="text-xs text-gray-600">Scheduler actif</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <TrendingUp className="w-5 h-5 text-purple-500" />
//               <div>
//                 <div className="font-medium text-sm">Statistiques</div>
//                 <div className="text-xs text-gray-600">Suivi détaillé</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
 


// src/app/(back-office)/rss-import/page.tsx
'use client';
 
import { useState, useEffect } from 'react';
import {
  Rss,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Clock,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
 
interface RSSourceResult {
  name: string;
  status: string;
  imported: number;
  skipped: number;
  errors: number;
  message: string;
  source?: string;
  lastSync?: string;
  totalArticles?: number;
}
 
interface RSSImportResult {
  imported: number;
  skipped: number;
  errors: number;
  sources: RSSourceResult[];
  totalProcessed: number;
  startTime?: string;
  endTime?: string;
  duration?: number;
}
 
export default function RSSImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RSSImportResult | null>(null);
  const [history, setHistory] = useState<RSSImportResult[]>([]);
  const [showDetails, setShowDetails] = useState(true);
 
  useEffect(() => {
    // Charger l'historique des imports au chargement de la page
    fetchImportHistory();
  }, []);
 
  const fetchImportHistory = async () => {
    try {
      const response = await api.get("/admin/scraper/history");
      if (response && response.data) setHistory(response.data);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };
 
  const handleImportRSS = async () => {
    setIsLoading(true);
    setResult(null);
 
    const startTime = new Date().toISOString();
 
    try {
      const response = await api.post("/admin/scraper/import");
      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
 
      setResult({
        ...response.data,
        startTime,
        endTime,
        duration
      });
 
      // Ajouter à l'historique
      const newHistory = {
        ...response.data,
        startTime,
        endTime,
        duration
      };
      setHistory(prev => [newHistory, ...prev.slice(0, 9)]); // Garder 10 derniers
    } catch (error: any) {
      console.error('Erreur import RSS:', error);
      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
 
      setResult({
        imported: 0,
        skipped: 0,
        errors: 1,
        sources: [],
        totalProcessed: 0,
        startTime,
        endTime,
        duration
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'partial':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };
 
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };
 
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
 
  const getOverallStatus = () => {
    if (!result) return 'pending';
    if (result.errors > 0 && result.imported === 0) return 'error';
    if (result.errors > 0) return 'partial';
    return 'success';
  };
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Rss className="w-8 h-8 text-orange-500" />
              Import RSS
            </h1>
            <p className="text-gray-600 mt-2">
              Importez les articles depuis les flux RSS des sources tourisme africain
            </p>
          </div>
          
          <button
            onClick={handleImportRSS}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Lancer l'importation
              </>
            )}
          </button>
        </div>
      </div>
 
      {/* Statistiques principales */}
      {result && (
        <div className="mb-8">
          {/* Statut global */}
          <div className={`rounded-xl border-2 p-6 mb-6 ${getStatusColor(getOverallStatus())}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(getOverallStatus())}
                <div>
                  <h2 className="text-xl font-bold">
                    {getOverallStatus() === 'success' && 'Importation réussie !'}
                    {getOverallStatus() === 'partial' && 'Importation partielle'}
                    {getOverallStatus() === 'error' && 'Importation échouée'}
                    {getOverallStatus() === 'pending' && 'Importation en cours...'}
                  </h2>
                  <p className="text-sm opacity-75">
                    {result.startTime && result.endTime && (
                      <>Terminée à {formatTime(result.endTime)} ({formatDuration(result.duration || 0)})</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">{result.imported}</div>
                  <div className="text-sm">Importés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{result.skipped}</div>
                  <div className="text-sm">Ignorés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{result.errors}</div>
                  <div className="text-sm">Erreurs</div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Graphique simple */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Taux de réussite</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {result.totalProcessed > 0
                  ? Math.round((result.imported / result.totalProcessed) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500">
                {result.imported} / {result.totalProcessed} articles
              </div>
            </div>
 
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Sources traitées</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {result.sources.length}
              </div>
              <div className="text-xs text-gray-500">
                Sur 46 sources disponibles
              </div>
            </div>
 
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Durée totale</span>
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(result.duration || 0)}
              </div>
              <div className="text-xs text-gray-500">
                Temps de traitement
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Détails par source */}
      {result && result.sources.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Détails par source</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showDetails ? 'Masquer' : 'Afficher'} les détails
              </button>
            </div>
          </div>
 
          {showDetails && (
            <div className="divide-y">
              {result.sources.map((source, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(source.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.message}</p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(source.status)}`}>
                      {source.status === 'success' && 'Succès'}
                      {source.status === 'partial' && 'Partiel'}
                      {source.status === 'error' && 'Erreur'}
                    </div>
                  </div>
 
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">{source.imported}</div>
                      <div className="text-xs text-green-700">Importés</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-yellow-600">{source.skipped}</div>
                      <div className="text-xs text-yellow-700">Ignorés</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-red-600">{source.errors}</div>
                      <div className="text-xs text-red-700">Erreurs</div>
                    </div>
                  </div>
 
                  {source.errors > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Erreurs détectées</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{source.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
 
      {/* Historique des imports */}
      {history.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Historique des imports</h2>
          </div>
          <div className="divide-y">
            {history.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(getOverallStatus())}
                    <div>
                      <div className="font-medium">
                        Import du {new Date(item.startTime || '').toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.imported} importés, {item.skipped} ignorés, {item.errors} erreurs
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.startTime && formatTime(item.startTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* État initial */}
      {!result && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Prêt à importer les flux RSS
          </h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur le bouton "Lancer l'importation" pour commencer à récupérer les articles
            depuis les 46 sources RSS configurées.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-sm">46 sources</div>
                <div className="text-xs text-gray-600">Magazines tourisme</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <RefreshCw className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium text-sm">Auto toutes les 6h</div>
                <div className="text-xs text-gray-600">Scheduler actif</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-sm">Statistiques</div>
                <div className="text-xs text-gray-600">Suivi détaillé</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 




