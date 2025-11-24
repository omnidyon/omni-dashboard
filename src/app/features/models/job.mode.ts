export interface Job {
  id: string;
  source: string;
  externalId: string;
  title: string;
  link: string;
  budget: number | null;
  hourly: boolean;
  currency: string;
  rawDescription: string;
  createdAt: string;
  proposal: string;
  status: 'NEW' | 'APPLIED' | 'REJECTED' | 'ARCHIVED';
}