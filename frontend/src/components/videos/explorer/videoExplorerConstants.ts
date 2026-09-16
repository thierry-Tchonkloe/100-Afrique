// src/components/videos/explorer/videoExplorerConstants.ts
export interface CategoryFilter {
  id: string;
  label: string;
}

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all',              label: 'Toutes'             },
  { id: 'hotellerie',       label: 'Hôtellerie'         },
  { id: 'transport',        label: 'Transport'          },
  { id: 'restauration',     label: 'Restauration'       },
  { id: 'voyages-affaires', label: "Voyages d'Affaires" },
  { id: 'mice-evenements',  label: 'MICE & Événements'  },
  { id: 'divertissement',   label: 'Divertissement'     },
  { id: 'tourisme-durable', label: 'Tourisme Durable'   },
];

export const PAGE_SIZE = 8;

export type SortOption = 'createdAt:desc' | 'createdAt:asc' | 'views:desc';