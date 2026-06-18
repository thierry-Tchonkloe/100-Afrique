// src/components/about/EditorialTeamSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';
import api from '@/lib/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  linkedin_url: string;
}

const FALLBACK_TEAM: TeamMember[] = [
  { id: '1', name: 'Aminata Diallo',      role: 'Directrice de Publication',   description: "Experte en communication touristique avec 15 ans d'expérience dans le secteur.",    image_url: '/images/team/aminata.jpg',        linkedin_url: '#' },
  { id: '2', name: 'Jean-Baptiste Koné',  role: 'Rédacteur en Chef',            description: 'Journaliste spécialisé en tourisme et développement durable en Afrique.',            image_url: '/images/team/jean-baptiste.jpg',  linkedin_url: '#' },
  { id: '3', name: 'Fatou Ndiaye',        role: 'Responsable Partenariats',     description: 'Spécialiste des relations B2B et développement commercial dans le tourisme.',        image_url: '/images/team/fatou.jpg',          linkedin_url: '#' },
  { id: '4', name: 'Ibrahima Traoré',     role: 'Journaliste — Destinations',   description: "Passionné des destinations africaines, il couvre l'Afrique de l'Ouest et du Centre.", image_url: '/images/team/ibrahima.jpg',       linkedin_url: '#' },
  { id: '5', name: 'Mariama Bah',         role: 'Responsable Vidéo',            description: 'Réalisatrice de documentaires touristiques primés, elle dirige la plateforme iTourisme TV.', image_url: '/images/team/mariama.jpg',   linkedin_url: '#' },
];

/**
 * Empreinte bento : tailles de cellules inégales (grand bloc / portrait / large bas)
 * pour reproduire la structure de mosaïque asymétrique, en grille CSS dense.
 * Le motif boucle sur lui-même si l'équipe compte plus de 6 personnes.
 */
const BENTO_PATTERN = [
  'col-span-2 row-span-2',  // grand bloc
  'col-span-1 row-span-3',  // portrait, tout en hauteur
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',  // bloc large bas
  'col-span-1 row-span-2',
  'col-span-1 row-span-3',
];

const EditorialTeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/about/team')
      .then((r) => { if (r.data?.length) setTeam(r.data); else setTeam(FALLBACK_TEAM); })
      .catch(() => setTeam(FALLBACK_TEAM))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-6" style={{ background: '#F6F7F8' }}>
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
            Les visages derrière le média
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tight" style={{ color: '#1A2B4A' }}>
            L&apos;équipe éditoriale &amp; partenariats
          </h2>
        </div>

        {/* ── MOSAÏQUE BENTO ── */}
        {loading ? (
          /* Skeleton bento */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-flow-dense auto-rows-[120px] sm:auto-rows-[140px] gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl animate-pulse ${BENTO_PATTERN[i % BENTO_PATTERN.length]}`}
                style={{ background: '#E2E8F0' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-flow-dense auto-rows-[120px] sm:auto-rows-[140px] gap-4">
            {team.map((member, i) => (
              <div
                key={member.id}
                className={`rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${BENTO_PATTERN[i % BENTO_PATTERN.length]}`}
                style={{ background: '#E2E8F0' }}
                onMouseEnter={() => setActiveId(member.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* Photo */}
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback : fond émeraude avec initiales
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      (e.target as HTMLImageElement).style.display = 'none';
                      parent.style.background = '#1A5C43';
                      const fallback = document.createElement('div');
                      fallback.className = 'absolute inset-0 flex flex-col items-center justify-center';
                      fallback.innerHTML = `
                        <span style="font-size:2.5rem;font-weight:700;color:rgba(200,168,75,0.9);font-family:serif;">
                          ${member.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />

                {/* Overlay hover */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(26,92,67,0.95) 0%, rgba(26,92,67,0.4) 50%, transparent 100%)',
                    opacity: activeId === member.id ? 1 : 0,
                  }}
                >
                  <h3 className="text-white font-serif font-bold text-base leading-tight">{member.name}</h3>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: '#C8A84B' }}>
                    {member.role}
                  </p>
                  <p className="text-white/75 text-xs mt-2 leading-relaxed line-clamp-2">{member.description}</p>
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: '#C8A84B' }}
                  >
                    <div className="p-1 rounded" style={{ background: '#0A66C2' }}>
                      <Linkedin size={11} className="text-white" fill="white" />
                    </div>
                    Voir le profil
                  </a>
                </div>

                {/* Chip nom — toujours visible en bas quand pas hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 transition-opacity duration-200"
                  style={{
                    background: 'linear-gradient(to top, rgba(26,92,67,0.85), transparent)',
                    opacity: activeId === member.id ? 0 : 1,
                  }}
                >
                  <p className="text-white text-xs font-bold">{member.name}</p>
                  <p className="text-[10px]" style={{ color: '#C8A84B' }}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default EditorialTeamSection;