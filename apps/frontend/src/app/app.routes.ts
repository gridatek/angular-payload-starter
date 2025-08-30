import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/post-list/post-list.component').then(m => m.PostListComponent),
    title: 'Home - My Blog'
  },
  {
    path: 'post/:slug',
    loadComponent: () => import('./components/post-detail/post-detail.component').then(m => m.PostDetailComponent),
    title: 'Post - My Blog'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'About - My Blog'
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'Categories - My Blog'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
