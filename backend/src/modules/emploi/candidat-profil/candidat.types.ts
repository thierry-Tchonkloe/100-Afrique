// src/types/emploi/candidat.types.ts

export interface UpdateIdentityInput {
  firstName: string;
  lastName: string;
  headline?: string;
  city?: string;
  mobility?: string;
  bio?: string;
}

export interface UpdateSkillsInput {
  hardSkills?: string[];
  softSkills?: string[];
  languages?: { name: string; level: string }[];
}

export interface UpdateVisibilityInput {
  isVisible?: boolean;
  availability?: string;
}

export interface CreateExperienceInput {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  contractType?: string;
  missions?: string[];
}

export type UpdateExperienceInput = Partial<CreateExperienceInput>;

export interface CreateFormationInput {
  diploma: string;
  school: string;
  year: string;
}

export type UpdateFormationInput = Partial<CreateFormationInput>;

export interface ApplyToJobInput {
  jobId: number;
}

export interface ExperienceOutput {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate?: string;
  contractType: string;
  missions: string[];
}

export interface FormationOutput {
  id: string;
  diploma: string;
  school: string;
  year: string;
}

export interface CandidatProfilOutput {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  headline: string;
  city: string;
  mobility: string;
  bio: string;
  experiences: ExperienceOutput[];
  formations: FormationOutput[];
  hardSkills: string[];
  softSkills: string[];
  languages: object[];
  cvFile?: { name: string; updatedAt: string };
  isVisible: boolean;
  availability: string;
  profileStrength: number;
}