import { Component, computed, inject, signal } from '@angular/core';
import { JobService } from '../../services/job-service';
import { Router } from '@angular/router';
import { Job } from '../../models/job.mode';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'omni-jobs-list',
  standalone: true,
  imports: [UpperCasePipe, DatePipe],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {
 private jobService = inject(JobService);
  private router = inject(Router);
  
  // Use the service's jobs signal directly
  jobs = this.jobService.jobs;
  statusFilter = signal<string>('ALL');
  isLoading = signal(true);
  
  // Computed filtered jobs
  filteredJobs = computed(() => {
    const filter = this.statusFilter();
    const jobs = this.jobs();
    
    if (filter === 'ALL') return jobs;
    return jobs.filter(job => job.status === filter);
  });
  
  async ngOnInit() {
    await this.loadJobs();
  }
  
  private async loadJobs() {
    this.isLoading.set(true);
    await this.jobService.loadJobs();
    this.isLoading.set(false);
  }
  
  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }
  
  viewJobDetails(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
}
