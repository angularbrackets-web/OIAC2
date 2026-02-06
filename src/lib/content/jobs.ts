import { getJobsFromDB, getJobById } from '../db';

export type Job = {
  id: string;
  title: string;
  postedDate: string;
  description?: {
    html: string;
  } | null;
  requireAlbertaCertification?: boolean;
  active?: boolean;
};

export async function getJobs(): Promise<Job[]> {
  const records = await getJobsFromDB();

  return records
    .filter(record => record.active !== false)
    .map(record => ({
      id: record.id,
      title: record.title,
      postedDate: record.postedDate,
      description: record.description ? { html: record.description } : null,
      requireAlbertaCertification: record.requireAlbertaCertification ?? undefined,
      active: record.active,
    }));
}

export async function getJob(id: string): Promise<Job | undefined> {
  const record = await getJobById(id);

  if (!record) return undefined;

  return {
    id: record.id,
    title: record.title,
    postedDate: record.postedDate,
    description: record.description ? { html: record.description } : null,
    requireAlbertaCertification: record.requireAlbertaCertification ?? undefined,
    active: record.active,
  };
}
