// src/services/emploi/alertes.service.ts
import { alerteJobRepository } from './alerteJob.repository';
import type { CreateAlerteInput, UpdateAlerteInput } from './alerte.types';

const FREQ: Record<string, string> = { realtime: 'REALTIME', daily: 'DAILY', weekly: 'WEEKLY' };
const FREQ_REV: Record<string, string> = { REALTIME: 'realtime', DAILY: 'daily', WEEKLY: 'weekly' };

function toOutput(a: any) {
  return {
    id: String(a.id),
    name: a.name,
    keywords: a.keywords as string[],
    location: a.location ?? '',
    radius: a.radius ?? undefined,
    contractTypes: a.contractTypes as string[],
    sector: a.sector ?? '',
    frequency: FREQ_REV[a.frequency] ?? 'daily',
    isActive: a.isActive,
    lastSentAt: a.lastSentAt?.toISOString(),
    createdAt: a.createdAt.toISOString(),
  };
}

export const alertesService = {
  async list(userId: number) {
    const rows = await alerteJobRepository.findManyForUser(userId);
    return rows.map(toOutput);
  },

  async create(userId: number, input: CreateAlerteInput) {
    const row = await alerteJobRepository.create(userId, {
      name: input.name,
      keywords: input.keywords ?? [],
      contractTypes: input.contractTypes ?? [],
      location: input.location,
      radius: input.radius,
      sector: input.sector,
      frequency: FREQ[input.frequency ?? 'daily'] ?? 'DAILY',
      isActive: input.isActive ?? true,
    });
    return toOutput(row);
  },

  async update(alerteId: number, input: UpdateAlerteInput) {
    const { frequency, ...rest } = input;
    const row = await alerteJobRepository.update(alerteId, {
      ...rest,
      ...(frequency && { frequency: FREQ[frequency] ?? 'DAILY' }),
    });
    return toOutput(row);
  },

  async toggle(alerteId: number, isActive: boolean) {
    const row = await alerteJobRepository.toggle(alerteId, isActive);
    return toOutput(row);
  },

  async remove(alerteId: number): Promise<void> {
    await alerteJobRepository.delete(alerteId);
  },
};