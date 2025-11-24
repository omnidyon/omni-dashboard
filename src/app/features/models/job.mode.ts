export type JobStatus = 'NEW' | 'PROCESSED' | 'IGNORED';

export interface Job {
  id: string;
  source: string;
  externalId: string | null;
  title: string;
  link: string;
  budget: number | null;
  hourly: boolean;
  currency: string | null;
  rawDescription: string | null;
  proposal: string | null;
  status: JobStatus;
  createdAt: string;
}