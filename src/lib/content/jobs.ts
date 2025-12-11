import { getCollection } from 'astro:content';

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
  const jobs = await getCollection('jobs', (entry) => {
    return entry.data.active !== false;
  });

  return jobs.map(job => ({
    id: job.id,
    title: job.data.title,
    postedDate: job.data.postedDate,
    description: job.data.description ? { html: job.data.description } : null,
    requireAlbertaCertification: job.data.requireAlbertaCertification ?? undefined,
    active: job.data.active,
  }));
}

export async function getJob(id: string): Promise<Job | undefined> {
  const jobs = await getCollection('jobs');
  const job = jobs.find(j => j.id === id);

  if (!job) return undefined;

  return {
    id: job.id,
    title: job.data.title,
    postedDate: job.data.postedDate,
    description: job.data.description ? { html: job.data.description } : null,
    requireAlbertaCertification: job.data.requireAlbertaCertification ?? undefined,
    active: job.data.active,
  };
}
