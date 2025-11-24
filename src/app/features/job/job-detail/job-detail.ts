import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Job } from '../../models/job.mode';
import { JobService } from '../../services/job-service';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'omni-job-detail',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './job-detail.html',
  styleUrls: ['./job-detail.scss'],
})
export class JobDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private jobService = inject(JobService);
  private sanitizer = inject(DomSanitizer);

  job = signal<Job | null>(null);
  sanitizedJobUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      await this.loadJob(jobId);
    }
  }

  private async loadJob(id: string) {
    this.isLoading.set(true);

    const job = await this.jobService.getJob(id);
    if (job) {
      this.job.set(job);
      // Use direct link since proxy doesn't work
      this.sanitizedJobUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl('about:blank'));
    } else {
      this.router.navigate(['/']);
    }

    this.isLoading.set(false);
  }

  async updateStatus(status: Job['status']) {
    const currentJob = this.job();
    if (!currentJob) return;

    const updatedJob = await this.jobService.updateJobStatus(currentJob.id, status);
    if (updatedJob) {
      this.job.set(updatedJob);
    }
  }

  async copyProposal() {
    const currentJob = this.job();
    if (!currentJob?.proposal) return;

    try {
      await navigator.clipboard.writeText(currentJob.proposal);
      console.log('Proposal copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy proposal:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentJob.proposal;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  async deleteJob() {
    const currentJob = this.job();
    if (!currentJob) return;

    if (confirm('Are you sure you want to delete this job?')) {
      const success = await this.jobService.deleteJob(currentJob.id);
      if (success) {
        this.router.navigate(['/']);
      } else {
        alert('Failed to delete job');
      }
    }
  }

  ngOnDestroy() {
    this.sanitizedJobUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl('about:blank'));
  }
}
