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
  try {
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
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJob(id: string): Promise<Job | undefined> {
  try {
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
  } catch (error) {
    console.error('Error fetching job:', error);
    return undefined;
  }
}
