import { Component, computed, inject, signal } from '@angular/core';
import { JobService } from '../../services/job-service';
import { Router } from '@angular/router';
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
    return jobs.filter((job) => job.status === filter);
  });

  async ngOnInit() {
    await this.loadJobs();
  }

  private async loadJobs() {
    this.isLoading.set(true);
    await this.jobService.loadJobs();
    this.isLoading.set(false);
  }

  protected async deleteJob(event: Event, jobId: string) {
    event.stopPropagation(); // Prevent card click

    if (confirm('Are you sure you want to delete this job?')) {
      const success = await this.jobService.deleteJob(jobId);
      if (success) {
        console.log('Job deleted successfully');
        // The job is automatically removed from the signal via the service
      } else {
        alert('Failed to delete job');
      }
    }
  }

  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }

  viewJobDetails(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
}
