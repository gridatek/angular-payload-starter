import { Component, OnInit, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import {BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Categories</h1>
        <p class="text-xl text-gray-600">Browse posts by category</p>
      </div>
    
      <!-- Loading State -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    
      <!-- Error State -->
      @if (error) {
        <div class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Categories</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button
              (click)="loadCategories()"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Try Again
            </button>
          </div>
        </div>
      }
    
      <!-- Categories Grid -->
      @if (!isLoading && !error) {
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (category of categories; track trackByCategoryId($index, category)) {
            <div
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500">{{ category.slug }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">
                    <!-- You can add post count here when available -->
                    Category
                  </span>
                  <button class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    View Posts →
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    
      <!-- Empty State -->
      @if (!isLoading && !error && categories.length === 0) {
        <div class="text-center py-16">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No categories yet</h3>
          <p class="text-gray-600">Categories will appear here when they're created.</p>
        </div>
      }
    
      <div class="mt-12 text-center">
        <a routerLink="/"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Posts
        </a>
      </div>
    </div>
    `
})
export class CategoriesComponent implements OnInit {
  private blogService = inject(BlogService);

  categories: any[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = null;

    this.blogService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.docs;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load categories. Please try again.';
        this.isLoading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  trackByCategoryId(index: number, category: any): string {
    return category.id;
  }
}
