import { Routes } from '@angular/router';

export const routes: Routes = [
      {
    path: '',
    loadComponent: () => import('./features/job/jobs-list/jobs-list').then(c => c.JobsList)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./features/job/job-detail/job-detail').then(c => c.JobDetail)
  }
];
