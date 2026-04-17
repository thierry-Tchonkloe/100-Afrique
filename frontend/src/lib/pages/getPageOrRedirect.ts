// // lib/pages/getPageOrRedirect.ts
// import { redirect, notFound } from "next/navigation";
// //import { getPageBySlug } from "@/services/Dashboard/pageservice";
// //import type { PageData } from "@/components/page-templates/types";
// import api from '@/lib/api'
// import { Article } from "@/services/Dashboard/articleservice";

// export type PageGuardResult = {
//     page: Article;
// };

// /**
//  * Récupère la page, vérifie les règles d'accès,
//  * et redirige / renvoie 404 si besoin.
//  * À appeler dans les Server Components (page.tsx).
//  */
// export async function getPageOrRedirect(
//     slug: string,
//     opts: { allowDraft?: boolean; allowPrivate?: boolean } = {}
// ): Promise<PageGuardResult> {
//     // const res = await getPageBySlug(slug); // votre service existant

//     const res = api.get(`/mag/articles/${slug}`);

//     console.log("voici les resultats",res)

//     // 1. Page introuvable
//     if (!res?.data) notFound();

//     const page = res.data;

//     // 2. Page archivée → toujours 404 côté public
//     if (page.status === "ARCHIVED") notFound();

//     // 3. Brouillon → accessible seulement si allowDraft (dashboard)
//     if (page.status === "DRAFT" && !opts.allowDraft) notFound();

//     // 4. En révision → idem
//     if (page.status === "REVIEW" && !opts.allowDraft) notFound();

//     // 5. Page privée → accessible seulement si allowPrivate (dashboard)
//     if (page.visibility === "private" && !opts.allowPrivate) {
//         redirect("/login");
//     }

//     // 6. Mauvais slug (ex: slug changé après publication) → redirect 301
//     if (page.slug !== slug) {
//         redirect(`/pages-statiques/${page.slug}`);
//     }

//     return { page };
// }





// lib/pages/getPageOrRedirect.ts
import { redirect, notFound } from "next/navigation";
import { getPageBySlug } from "@/services/Dashboard/pageservice";
import type { PageData } from "@/components/page-templates/types";
import { Article } from "@/services/Dashboard/articleservice";

export type PageGuardResult = {
    page: Article;
};

export async function getPageOrRedirect(
    slug: string,
    opts: { allowDraft?: boolean; allowPrivate?: boolean } = {}
): Promise<PageGuardResult> {
    let page: Article | null = null;

    try {
        const res = await getPageBySlug(slug);
        // Adapter selon ce que retourne réellement votre service :
        // cas 1 : res.data.data  (Axios wrappé dans { data: Article })
        // cas 2 : res.data       (Axios standard)
        // cas 3 : res            (service déjà dépaquété)
        page =res?.data?.data || res?.data || res || null;
    } catch {
        notFound();
    }

    if (!page) notFound();

    if (page?.status === "ARCHIVED") notFound();
    if (page?.status === "DRAFT"  && !opts.allowDraft)   notFound();
    if (page?.status === "REVIEW" && !opts.allowDraft)   notFound();
    if (page?.visibility === "private" && !opts.allowPrivate) redirect("/login");
    if (page?.slug !== slug) redirect(`/pages-statiques/${page?.slug}`);

    return { page };
}