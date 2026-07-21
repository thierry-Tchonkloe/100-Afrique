// src/components/contact/EditorialTeamSection.tsx
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
  { id: '1', name: 'Aminata Diallo',    role: 'Directrice de Publication',  description: "Experte en communication touristique avec 15 ans d'expérience dans le secteur.",    image_url: '/images/team/aminata.jpg',       linkedin_url: '#' },
  { id: '2', name: 'Jean-Baptiste Koné', role: 'Rédacteur en Chef',          description: "Journaliste spécialisé en tourisme et développement durable en Afrique.",            image_url: '/images/team/jean-baptiste.jpg', linkedin_url: '#' },
  { id: '3', name: 'Fatou Ndiaye',       role: 'Responsable Partenariats',   description: "Spécialiste des relations B2B et développement commercial dans le tourisme.",        image_url: '/images/team/fatou.jpg',         linkedin_url: '#' },
];

const EditorialTeamSection = () => {
  const [team, setTeam]       = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/about/team');
        if (response.data) setTeam(response.data);
      } catch {
        setTeam(FALLBACK_TEAM);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-it-blue text-center uppercase mb-16 tracking-wide">
          L&apos;équipe éditoriale et partenariats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-80 overflow-hidden relative">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-it-blue mb-1">
                  {member.name}
                </h3>
                <p className="text-it-terracotta font-medium text-sm mb-4">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                  {member.description}
                </p>

                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-it-blue hover:text-it-terracotta transition-colors text-sm font-bold"
                >
                  <div className="bg-it-emerald-dark p-1 rounded group-hover:bg-it-terracotta transition-colors">
                    <Linkedin size={14} className="text-white" fill="currentColor" />
                  </div>
                  Voir le profil
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialTeamSection;
