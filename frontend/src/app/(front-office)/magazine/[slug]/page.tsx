// src/app/(front-office)/magazine/[slug]/page.tsx
import type { Metadata } from "next";
import MagazineDetailPage from "@/components/magazine/MagazineDetailPage";

export const metadata: Metadata = {
  title: "Détail Magazine | Waxeho",
  description:
    "Consultez l'aperçu détaillé d'un magazine importé depuis nos ressources éditoriales.",
};

export default function MagazineSlugPage() {
  return <MagazineDetailPage />;
}
