// app/pages/[slug]/page.tsx
import { getPageOrRedirect } from "@/lib/pages/getPageOrRedirect";
import PagePreview from "@/components/page-templates/PagePreview";
import { toPageData } from "@/lib/pages/toPageData";
import type { Metadata } from "next";

interface Props {
    params: { slug: string };
}

// SEO dynamique depuis les données de la page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page } = await getPageOrRedirect(params.slug);
    return {
        title:       page.metaTitle       || page.title,
        description: page.metaDescription || undefined,
    };
}

export default async function PublicPageRoute({ params }: Props) {
    const { page } = await getPageOrRedirect(params.slug, {
        allowDraft:   false,  // brouillons invisibles côté public
        allowPrivate: false,
    });

    return <PagePreview page={toPageData(page)} />;
}