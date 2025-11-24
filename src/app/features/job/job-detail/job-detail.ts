import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SanitizerService } from '../../../core/services/sanitizer-service';
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
  private sanitizerService = inject(SanitizerService);

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
      this.sanitizedJobUrl.set(this.sanitizerService.sanitizeJobUrl(job.link));
    } else {
      // Handle job not found - maybe redirect to list
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

  ngOnDestroy() {
    // Clean up iframe
    this.sanitizedJobUrl.set(this.sanitizerService.sanitizeJobUrl('about:blank'));
  }
}
