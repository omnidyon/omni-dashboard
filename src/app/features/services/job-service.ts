import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.mode';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private _jobs = signal<Job[]>([]); // Fixed: renamed to _jobs
  private apiUrl = 'https://your-nest-backend.com/api/jobs';

  // Public read-only signal
  jobs = this._jobs.asReadonly();

  async loadJobs(): Promise<void> {
    try {
      const jobs = await this.http.get<Job[]>(this.apiUrl).toPromise();
      if (jobs) {
        this._jobs.set(jobs);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  }

  async getJob(id: string): Promise<Job | null> {
    try {
      return await this.http.get<Job>(`${this.apiUrl}/${id}`).toPromise() || null;
    } catch (error) {
      console.error('Failed to load job:', error);
      return null;
    }
  }

  async updateJobStatus(id: string, status: Job['status']): Promise<Job | null> {
    try {
      const updatedJob = await this.http.patch<Job>(`${this.apiUrl}/${id}`, { status }).toPromise();
      if (updatedJob) {
        this._jobs.update(jobs => 
          jobs.map(job => job.id === id ? updatedJob : job)
        );
        return updatedJob;
      }
      return null;
    } catch (error) {
      console.error('Failed to update job status:', error);
      return null;
    }
  }
}