// src/types/emploi/common.types.ts
//
// Types partagés par tout le module Emploi. Règle d'équipe : un type par
// forme de donnée qui traverse une frontière (entrée HTTP, sortie HTTP,
// retour de repository). On n'écrit plus `req.body as any` ni de littéral
// inline dans un contrôleur.

export interface AuthenticatedEmploiUser {
  id: number;
  email: string;
  role: 'CANDIDAT' | 'RECRUITER';
  firstName: string;
  lastName: string;
}

export interface JsonSuccessEnvelope<T> {
  success: true;
  message?: string;
  data: T;
}