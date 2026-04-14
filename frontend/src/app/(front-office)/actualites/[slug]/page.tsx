// // src/app/(front-office)/actualites/[slug]/page.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, Clock, Eye, Calendar, Tag, User, Loader2 } from 'lucide-react';
// import api from '@/lib/api';

// interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: ContentBlock[];
//   coverImage: string;
//   createdAt: string;
//   updatedAt: string;
//   views: number;
//   featured: boolean;
//   metaTitle?: string;
//   metaDescription?: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//     color?: string;
//   };
//   author: {
//     id: number;
//     name: string;
//   };
//   tags?: { id: number; name: string; slug: string }[];
//   destination?: {
//     id: number;
//     name: string;
//     slug: string;
//   } | null;
// }

// interface ContentBlock {
//   type: 'text' | 'heading' | 'image' | 'video';
//   value?: string;
//   url?: string;
// }

// interface RelatedArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   excerpt: string;
//   category: { name: string };
//   author: { name: string };
// }

// // ─── Content Renderer ────────────────────────────────────────────────────────

// const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => {
//   return (
//     <div className="prose prose-lg max-w-none">
//       {blocks.map((block, index) => {
//         switch (block.type) {
//           case 'heading':
//             return (
//               <h2
//                 key={index}
//                 className="text-2xl md:text-3xl font-bold text-[#001A4D] mt-10 mb-4 leading-snug"
//               >
//                 {block.value}
//               </h2>
//             );
//           case 'text':
//             return (
//               <p
//                 key={index}
//                 className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line"
//               >
//                 {block.value}
//               </p>
//             );
//           case 'image':
//             return (
//               <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
//                 <img
//                   src={block.url}
//                   alt="Illustration"
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             );
//           case 'video':
//             return (
//               <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-md">
//                 <iframe
//                   src={block.url}
//                   className="w-full h-full"
//                   allowFullScreen
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 />
//               </div>
//             );
//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// };

// // ─── Related Article Card ─────────────────────────────────────────────────────

// const RelatedCard = ({ article }: { article: RelatedArticle }) => (
//   <Link href={`/actualites/${article.slug}`} className="group flex flex-col">
//     <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
//       <img
//         src={article.coverImage || "/images/placeholder.jpg"}
//         alt={article.title}
//         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//       />
//       <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
//         {article.category.name}
//       </span>
//     </div>
//     <h3 className="text-base font-bold text-[#001A4D] leading-snug mb-2 group-hover:text-[#F39C12] transition-colors line-clamp-2">
//       {article.title}
//     </h3>
//     <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
//     <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
//       <span>Par {article.author.name}</span>
//       <span>•</span>
//       <span>
//         {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric',
//         })}
//       </span>
//     </div>
//   </Link>
// );

// // ─── Main Page Component ──────────────────────────────────────────────────────

// const ArticleDetailPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params?.slug as string;

//   const [article, setArticle] = useState<Article | null>(null);
//   const [related, setRelated] = useState<RelatedArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   const calculateReadingTime = (blocks: ContentBlock[]): number => {
//     const totalWords = blocks
//       .filter((b) => b.type === 'text' || b.type === 'heading')
//       .map((b) => (b.value || '').split(' ').length)
//       .reduce((a, b) => a + b, 0);
//     return Math.max(1, Math.ceil(totalWords / 200));
//   };

//   useEffect(() => {
//     if (!slug) return;

//     const fetchArticle = async () => {
//       try {
//         const res = await api.get(`/mag/articles/${slug}`);
//         const data: Article = res.data.data ?? res.data;
//         setArticle(data);

//         // Fetch related articles from the same category, excluding current
//         try {
//           const relRes = await api.get('/mag/articles', {
//             params: {
//               categoryId: data.category.id,
//               pageSize: 3,
//               status: 'PUBLISHED',
//             },
//           });
//           const relData: RelatedArticle[] = relRes.data.data ?? [];
//           setRelated(relData.filter((a) => a.slug !== slug).slice(0, 3));
//         } catch {
//           // Related articles are optional — fail silently
//         }
//       } catch (error) {
//         const axiosError = error as { response?: { status?: number } };
//         if (axiosError?.response?.status === 404) {
//           setNotFound(true);
//         } else {
//           console.error('Erreur chargement article:', error);
//           setNotFound(true);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticle();
//   }, [slug]);

//   // ── Loading ──
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
//         <Loader2 className="animate-spin text-[#F39C12]" size={44} />
//         <p className="text-[#001A4D] font-medium text-sm uppercase tracking-widest animate-pulse">
//           Chargement de l&apos;article...
//         </p>
//       </div>
//     );
//   }

//   // ── 404 ──
//   if (notFound || !article) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
//         <div className="text-center">
//           <p className="text-8xl font-black text-[#001A4D]/10 mb-2">404</p>
//           <h1 className="text-2xl font-bold text-[#001A4D] mb-3">Article introuvable</h1>
//           <p className="text-gray-500 mb-8 max-w-sm mx-auto">
//             Cet article n&apos;existe pas ou a été supprimé.
//           </p>
//           <Link
//             href="/actualites"
//             className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F39C12] transition-colors"
//           >
//             <ArrowLeft size={16} />
//             Retour aux actualités
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const readingTime = calculateReadingTime(article.content);
//   const parsedContent: ContentBlock[] = Array.isArray(article.content)
//     ? article.content
//     : [];

//   return (
//     <main className="min-h-screen bg-white">

//       {/* ── Hero Cover Image ─────────────────────────────────────── */}
//       <div className="relative w-full h-[420px] md:h-[560px]">
//         <Image
//           src={article.coverImage || "/images/placeholder.jpg"}
//           alt={article.title}
//           fill
//           className="object-cover"
//           priority
//         />
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/85 via-[#001A4D]/30 to-transparent" />

//         {/* Back button */}
//         <div className="absolute top-6 left-6 z-10">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
//           >
//             <ArrowLeft size={15} />
//             Retour
//           </button>
//         </div>

//         {/* Hero text overlay */}
//         <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto w-full">
//           <span className="inline-block bg-[#F39C12] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
//             {article.category.name}
//           </span>
//           <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl">
//             {article.title}
//           </h1>
//         </div>
//       </div>

//       {/* ── Article Body ──────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

//         {/* Meta bar */}
//         <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-8 mb-10">
//           <div className="flex items-center gap-2">
//             <User size={15} className="text-[#F39C12]" />
//             <span>Par <strong className="text-[#001A4D]">{article.author.name}</strong></span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Calendar size={15} className="text-[#F39C12]" />
//             <span>
//               {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric',
//               })}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock size={15} className="text-[#F39C12]" />
//             <span>{readingTime} min de lecture</span>
//           </div>
//           {article.views > 0 && (
//             <div className="flex items-center gap-2">
//               <Eye size={15} className="text-[#F39C12]" />
//               <span>{article.views.toLocaleString('fr-FR')} lectures</span>
//             </div>
//           )}
//         </div>

//         {/* Excerpt (chapô) */}
//         {article.excerpt && (
//           <p className="text-xl text-[#1A365D] font-medium leading-relaxed border-l-4 border-[#F39C12] pl-6 mb-10 italic">
//             {article.excerpt}
//           </p>
//         )}

//         {/* Article content */}
//         <ContentRenderer blocks={parsedContent} />

//         {/* Tags */}
//         {article.tags && article.tags.length > 0 && (
//           <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
//             <Tag size={16} className="text-gray-400" />
//             {article.tags.map((tag) => (
//               <span
//                 key={tag.id}
//                 className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F39C12]/10 hover:text-[#F39C12] transition-colors cursor-default"
//               >
//                 #{tag.name}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Destination link */}
//         {article.destination && (
//           <div className="mt-6 p-5 bg-[#001A4D]/5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination liée</p>
//               <p className="text-[#001A4D] font-bold text-lg">{article.destination.name}</p>
//             </div>
//             <Link
//               href={`/destinations/${article.destination.slug}`}
//               className="bg-[#001A4D] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#F39C12] transition-colors"
//             >
//               Découvrir
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* ── Related Articles ─────────────────────────────────────── */}
//       {related.length > 0 && (
//         <section className="bg-gray-50 py-16 px-4 md:px-8">
//           <div className="max-w-5xl mx-auto">
//             <div className="flex items-center justify-between mb-10">
//               <div>
//                 <h2 className="text-2xl font-bold text-[#001A4D] uppercase tracking-wide">
//                   Articles similaires
//                 </h2>
//                 <div className="w-12 h-1 bg-[#F39C12] mt-2 rounded-full" />
//               </div>
//               <Link
//                 href="/actualites"
//                 className="text-sm font-bold text-[#001A4D] hover:text-[#F39C12] transition-colors flex items-center gap-1"
//               >
//                 Voir tout
//                 <ArrowLeft size={14} className="rotate-180" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {related.map((a) => (
//                 <RelatedCard key={a.id} article={a} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── Back to news CTA ─────────────────────────────────────── */}
//       <div className="py-12 flex justify-center bg-white border-t border-gray-100">
//         <Link
//           href="/actualites"
//           className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-colors shadow-sm"
//         >
//           <ArrowLeft size={16} />
//           Toutes les actualités
//         </Link>
//       </div>
//     </main>
//   );
// };

// export default ArticleDetailPage;








// src/app/(front-office)/actualites/[slug]/page.tsx
"use client";
 
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Calendar, Tag, User, Loader2 } from 'lucide-react';
import api from '@/lib/api';
 
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  category: {
    id: number;
    name: string;
    slug: string;
    color?: string;
  };
  author: {
    id: number;
    name: string;
  };
  tags?: { id: number; name: string; slug: string }[];
  destination?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}
 
interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'video';
  value?: string;
  url?: string;
}
 
interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  category: { name: string };
  author: { name: string };
}
 
// ─── Content Renderer ────────────────────────────────────────────────────────
 
const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="text-2xl md:text-3xl font-bold text-[#001A4D] mt-10 mb-4 leading-snug"
              >
                {block.value}
              </h2>
            );
          case 'text':
            return (
              <p
                key={index}
                className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line"
              >
                {block.value}
              </p>
            );
          case 'image':
            return (
              <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={block.url}
                  alt="Illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            );
          case 'video':
            return (
              <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-md">
                <iframe
                  src={block.url}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
 
// ─── Related Article Card ─────────────────────────────────────────────────────
 
const RelatedCard = ({ article }: { article: RelatedArticle }) => (
  <Link href={`/actualites/${article.slug}`} className="group flex flex-col">
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
      <img
        src={article.coverImage || "/images/placeholder.jpg"}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
        {article.category.name}
      </span>
    </div>
    <h3 className="text-base font-bold text-[#001A4D] leading-snug mb-2 group-hover:text-[#F39C12] transition-colors line-clamp-2">
      {article.title}
    </h3>
    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
      <span>Par {article.author.name}</span>
      <span>•</span>
      <span>
        {new Date(article.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    </div>
  </Link>
);
 
// ─── Main Page Component ──────────────────────────────────────────────────────
 
const ArticleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
 
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
 
  const calculateReadingTime = (blocks: ContentBlock[]): number => {
    const totalWords = blocks
      .filter((b) => b.type === 'text' || b.type === 'heading')
      .map((b) => (b.value || '').split(' ').length)
      .reduce((a, b) => a + b, 0);
    return Math.max(1, Math.ceil(totalWords / 200));
  };
 
  useEffect(() => {
    if (!slug) return;
 
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/mag/articles/${slug}`);
        const data: Article = res.data.data ?? res.data;
        setArticle(data);
 
        // Fetch related articles from the same category, excluding current
        try {
          const relRes = await api.get('/mag/articles', {
            params: {
              categoryId: data.category.id,
              pageSize: 50,
              status: 'PUBLISHED',
            },
          });
          const relData: RelatedArticle[] = relRes.data.data ?? [];
          setRelated(relData.filter((a) => a.slug !== slug));
        } catch {
          // Related articles are optional — fail silently
        }
      } catch (error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Erreur chargement article:', error);
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
 
    fetchArticle();
  }, [slug]);
 
  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-[#F39C12]" size={44} />
        <p className="text-[#001A4D] font-medium text-sm uppercase tracking-widest animate-pulse">
          Chargement de l&apos;article...
        </p>
      </div>
    );
  }
 
  // ── 404 ──
  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-[#001A4D]/10 mb-2">404</p>
          <h1 className="text-2xl font-bold text-[#001A4D] mb-3">Article introuvable</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cet article n&apos;existe pas ou a été supprimé.
          </p>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F39C12] transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }
 
  const readingTime = calculateReadingTime(article.content);
  const parsedContent: ContentBlock[] = Array.isArray(article.content)
    ? article.content
    : [];
 
  return (
    <main className="min-h-screen bg-white">
 
      {/* ── Hero Cover Image ─────────────────────────────────────── */}
      <div className="relative w-full h-[420px] md:h-[560px]">
        <Image
          src={article.coverImage || "/images/placeholder.jpg"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/85 via-[#001A4D]/30 to-transparent" />
 
        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={15} />
            Retour
          </button>
        </div>
 
        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto w-full">
          <span className="inline-block bg-[#F39C12] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            {article.category.name}
          </span>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl">
            {article.title}
          </h1>
        </div>
      </div>
 
      {/* ── Article Body ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
 
        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-8 mb-10">
          <div className="flex items-center gap-2">
            <User size={15} className="text-[#F39C12]" />
            <span>Par <strong className="text-[#001A4D]">{article.author.name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#F39C12]" />
            <span>
              {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#F39C12]" />
            <span>{readingTime} min de lecture</span>
          </div>
          {article.views > 0 && (
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-[#F39C12]" />
              <span>{article.views.toLocaleString('fr-FR')} lectures</span>
            </div>
          )}
        </div>
 
        {/* Excerpt (chapô) */}
        {article.excerpt && (
          <p className="text-xl text-[#1A365D] font-medium leading-relaxed border-l-4 border-[#F39C12] pl-6 mb-10 italic">
            {article.excerpt}
          </p>
        )}
 
        {/* Article content */}
        <ContentRenderer blocks={parsedContent} />
 
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <Tag size={16} className="text-gray-400" />
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F39C12]/10 hover:text-[#F39C12] transition-colors cursor-default"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
 
        {/* Destination link */}
        {article.destination && (
          <div className="mt-6 p-5 bg-[#001A4D]/5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination liée</p>
              <p className="text-[#001A4D] font-bold text-lg">{article.destination.name}</p>
            </div>
            <Link
              href={`/destinations/${article.destination.slug}`}
              className="bg-[#001A4D] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#F39C12] transition-colors"
            >
              Découvrir
            </Link>
          </div>
        )}
      </div>
 
      {/* ── Related Articles ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-[#001A4D] uppercase tracking-wide">
                  Articles similaires
                </h2>
                <div className="w-12 h-1 bg-[#F39C12] mt-2 rounded-full" />
              </div>
              <Link
                href="/actualites"
                className="text-sm font-bold text-[#001A4D] hover:text-[#F39C12] transition-colors flex items-center gap-1"
              >
                Voir tout
                <ArrowLeft size={14} className="rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {related.map((a) => (
                <RelatedCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── Back to news CTA ─────────────────────────────────────── */}
      <div className="py-12 flex justify-center bg-white border-t border-gray-100">
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Toutes les actualités
        </Link>
      </div>
    </main>
  );
};
 
export default ArticleDetailPage;


// // src/app/(front-office)/actualites/[slug]/page.tsx
// "use client";
 
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, Clock, Eye, Calendar, Tag, User, Loader2 } from 'lucide-react';
// import api from '@/lib/api';
 
// interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: ContentBlock[];
//   coverImage: string;
//   createdAt: string;
//   updatedAt: string;
//   views: number;
//   featured: boolean;
//   metaTitle?: string;
//   metaDescription?: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//     color?: string;
//   };
//   author: {
//     id: number;
//     name: string;
//   };
//   tags?: { id: number; name: string; slug: string }[];
//   destination?: {
//     id: number;
//     name: string;
//     slug: string;
//   } | null;
// }
 
// interface ContentBlock {
//   type: 'text' | 'heading' | 'image' | 'video';
//   value?: string;
//   url?: string;
// }
 
// interface RelatedArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   excerpt: string;
//   category: { name: string };
//   author: { name: string };
// }
 
// // ─── Content Renderer ────────────────────────────────────────────────────────
 
// const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => {
//   return (
//     <div className="prose prose-lg max-w-none">
//       {blocks.map((block, index) => {
//         switch (block.type) {
//           case 'heading':
//             return (
//               <h2
//                 key={index}
//                 className="text-2xl md:text-3xl font-bold text-[#001A4D] mt-10 mb-4 leading-snug"
//               >
//                 {block.value}
//               </h2>
//             );
//           case 'text':
//             return (
//               <p
//                 key={index}
//                 className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line"
//               >
//                 {block.value}
//               </p>
//             );
//           case 'image':
//             return (
//               <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
//                 <img
//                   src={block.url}
//                   alt="Illustration"
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             );
//           case 'video':
//             return (
//               <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-md">
//                 <iframe
//                   src={block.url}
//                   className="w-full h-full"
//                   allowFullScreen
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 />
//               </div>
//             );
//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// };
 
// // ─── Related Article Card ─────────────────────────────────────────────────────
 
// const RelatedCard = ({ article }: { article: RelatedArticle }) => (
//   <Link href={`/actualites/${article.slug}`} className="group flex flex-col">
//     <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
//       <img
//         src={article.coverImage || "/images/placeholder.jpg"}
//         alt={article.title}
//         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//       />
//       <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
//         {article.category.name}
//       </span>
//     </div>
//     <h3 className="text-base font-bold text-[#001A4D] leading-snug mb-2 group-hover:text-[#F39C12] transition-colors line-clamp-2">
//       {article.title}
//     </h3>
//     <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
//     <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
//       <span>Par {article.author.name}</span>
//       <span>•</span>
//       <span>
//         {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric',
//         })}
//       </span>
//     </div>
//   </Link>
// );
 
// // ─── Main Page Component ──────────────────────────────────────────────────────
 
// const ArticleDetailPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params?.slug as string;
 
//   const [article, setArticle] = useState<Article | null>(null);
//   const [related, setRelated] = useState<RelatedArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);
 
//   const calculateReadingTime = (blocks: ContentBlock[]): number => {
//     const totalWords = blocks
//       .filter((b) => b.type === 'text' || b.type === 'heading')
//       .map((b) => (b.value || '').split(' ').length)
//       .reduce((a, b) => a + b, 0);
//     return Math.max(1, Math.ceil(totalWords / 200));
//   };
 
//   useEffect(() => {
//     if (!slug) return;
 
//     const fetchArticle = async () => {
//       try {
//         const res = await api.get(`/mag/articles/${slug}`);
//         const data: Article = res.data.data ?? res.data;
//         setArticle(data);
 
//         // Fetch related articles from the same category, excluding current
//         try {
//           const relRes = await api.get('/mag/articles', {
//             params: {
//               categoryId: data.category.id,
//               pageSize: 3,
//               status: 'PUBLISHED',
//             },
//           });
//           const relData: RelatedArticle[] = relRes.data.data ?? [];
//           setRelated(relData.filter((a) => a.slug !== slug).slice(0, 3));
//         } catch {
//           // Related articles are optional — fail silently
//         }
//       } catch (error) {
//         const axiosError = error as { response?: { status?: number } };
//         if (axiosError?.response?.status === 404) {
//           setNotFound(true);
//         } else {
//           console.error('Erreur chargement article:', error);
//           setNotFound(true);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchArticle();
//   }, [slug]);
 
//   // ── Loading ──
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
//         <Loader2 className="animate-spin text-[#F39C12]" size={44} />
//         <p className="text-[#001A4D] font-medium text-sm uppercase tracking-widest animate-pulse">
//           Chargement de l&apos;article...
//         </p>
//       </div>
//     );
//   }
 
//   // ── 404 ──
//   if (notFound || !article) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
//         <div className="text-center">
//           <p className="text-8xl font-black text-[#001A4D]/10 mb-2">404</p>
//           <h1 className="text-2xl font-bold text-[#001A4D] mb-3">Article introuvable</h1>
//           <p className="text-gray-500 mb-8 max-w-sm mx-auto">
//             Cet article n&apos;existe pas ou a été supprimé.
//           </p>
//           <Link
//             href="/actualites"
//             className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F39C12] transition-colors"
//           >
//             <ArrowLeft size={16} />
//             Retour aux actualités
//           </Link>
//         </div>
//       </div>
//     );
//   }
 
//   const readingTime = calculateReadingTime(article.content);
//   const parsedContent: ContentBlock[] = Array.isArray(article.content)
//     ? article.content
//     : [];
 
//   return (
//     <main className="min-h-screen bg-white">
 
//       {/* ── Hero Cover Image ─────────────────────────────────────── */}
//       <div className="relative w-full h-[420px] md:h-[560px]">
//         <Image
//           src={article.coverImage || "/images/placeholder.jpg"}
//           alt={article.title}
//           fill
//           className="object-cover"
//           priority
//         />
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/85 via-[#001A4D]/30 to-transparent" />
 
//         {/* Back button */}
//         <div className="absolute top-6 left-6 z-10">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
//           >
//             <ArrowLeft size={15} />
//             Retour
//           </button>
//         </div>
 
//         {/* Hero text overlay */}
//         <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto w-full">
//           <span className="inline-block bg-[#F39C12] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
//             {article.category.name}
//           </span>
//           <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl">
//             {article.title}
//           </h1>
//         </div>
//       </div>
 
//       {/* ── Article Body ──────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
 
//         {/* Meta bar */}
//         <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-8 mb-10">
//           <div className="flex items-center gap-2">
//             <User size={15} className="text-[#F39C12]" />
//             <span>Par <strong className="text-[#001A4D]">{article.author.name}</strong></span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Calendar size={15} className="text-[#F39C12]" />
//             <span>
//               {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric',
//               })}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock size={15} className="text-[#F39C12]" />
//             <span>{readingTime} min de lecture</span>
//           </div>
//           {article.views > 0 && (
//             <div className="flex items-center gap-2">
//               <Eye size={15} className="text-[#F39C12]" />
//               <span>{article.views.toLocaleString('fr-FR')} lectures</span>
//             </div>
//           )}
//         </div>
 
//         {/* Excerpt (chapô) */}
//         {article.excerpt && (
//           <p className="text-xl text-[#1A365D] font-medium leading-relaxed border-l-4 border-[#F39C12] pl-6 mb-10 italic">
//             {article.excerpt}
//           </p>
//         )}
 
//         {/* Article content */}
//         <ContentRenderer blocks={parsedContent} />
 
//         {/* Tags */}
//         {article.tags && article.tags.length > 0 && (
//           <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
//             <Tag size={16} className="text-gray-400" />
//             {article.tags.map((tag) => (
//               <span
//                 key={tag.id}
//                 className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F39C12]/10 hover:text-[#F39C12] transition-colors cursor-default"
//               >
//                 #{tag.name}
//               </span>
//             ))}
//           </div>
//         )}
 
//         {/* Destination link */}
//         {article.destination && (
//           <div className="mt-6 p-5 bg-[#001A4D]/5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination liée</p>
//               <p className="text-[#001A4D] font-bold text-lg">{article.destination.name}</p>
//             </div>
//             <Link
//               href={`/destinations/${article.destination.slug}`}
//               className="bg-[#001A4D] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#F39C12] transition-colors"
//             >
//               Découvrir
//             </Link>
//           </div>
//         )}
//       </div>
 
//       {/* ── Related Articles ─────────────────────────────────────── */}
//       {related.length > 0 && (
//         <section className="bg-gray-50 py-16 px-4 md:px-8">
//           <div className="max-w-5xl mx-auto">
//             <div className="flex items-center justify-between mb-10">
//               <div>
//                 <h2 className="text-2xl font-bold text-[#001A4D] uppercase tracking-wide">
//                   Articles similaires
//                 </h2>
//                 <div className="w-12 h-1 bg-[#F39C12] mt-2 rounded-full" />
//               </div>
//               <Link
//                 href="/actualites"
//                 className="text-sm font-bold text-[#001A4D] hover:text-[#F39C12] transition-colors flex items-center gap-1"
//               >
//                 Voir tout
//                 <ArrowLeft size={14} className="rotate-180" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {related.map((a) => (
//                 <RelatedCard key={a.id} article={a} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
 
//       {/* ── Back to news CTA ─────────────────────────────────────── */}
//       <div className="py-12 flex justify-center bg-white border-t border-gray-100">
//         <Link
//           href="/actualites"
//           className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-colors shadow-sm"
//         >
//           <ArrowLeft size={16} />
//           Toutes les actualités
//         </Link>
//       </div>
//     </main>
//   );
// };

// export default ArticleDetailPage;