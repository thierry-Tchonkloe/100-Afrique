// src/validators/emploi/vitrine.validator.ts
import { z } from 'zod';

export const updateVitrineSchema = z.object({
  body: z.object({
    slogan: z.string().max(300).optional(),
    location: z.string().optional(),
    sector: z.string().optional(),
    aboutUs: z.string().max(5000).optional(),
    kpis: z.array(z.record(z.string(), z.unknown())).optional(),
    values: z.array(z.record(z.string(), z.unknown())).optional(),
    perks: z.array(z.string()).optional(),
    photos: z.array(z.record(z.string(), z.unknown())).optional(),
    videos: z.array(z.record(z.string(), z.unknown())).optional(),
    socials: z.record(z.string(), z.string()).optional(),
    logoUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Email invalide').or(z.literal('')).optional(),
    certifications: z.array(z.string()).optional(),
    moments: z.array(z.record(z.string(), z.unknown())).optional(),
  }),
});

export const addVideoSchema = z.object({
  body: z.object({
    url: z.string().url('URL de vidéo invalide'),
    title: z.string().optional(),
  }),
});

export const videoIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const photoIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const etablissementIdParamSchema = z.object({
  params: z.object({ etablissementId: z.coerce.number().int().positive() }),
});