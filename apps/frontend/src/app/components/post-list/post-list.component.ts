import { Component, OnInit, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Post, PayloadResponse } from 'types';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Latest Posts</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights, tutorials, and thoughts on web development, technology, and more.
        </p>
      </div>
    
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    
      <!-- Error State -->
      @if (error) {
        <div class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg
              class="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Posts</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button
              (click)="loadPosts()"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
              Try Again
            </button>
          </div>
        </div>
      }
    
      <!-- Posts Grid -->
      @if (!isLoading() && !error) {
        <div class="space-y-8">
          <!-- Featured Post (First Post) -->
          @if (posts.length > 0) {
            <article
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
              <div class="md:flex">
                <div class="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
                  <div class="h-full flex flex-col justify-center">
                    <span
                      class="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4"
                      >
                      FEATURED
                    </span>
                    <h2 class="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                      <a
                        [routerLink]="['/post', posts[0].slug]"
                        class="hover:text-blue-100 transition-colors"
                        >
                        {{ posts[0].title }}
                      </a>
                    </h2>
                    @if (posts[0].excerpt) {
                      <p class="text-blue-100 mb-6 text-lg">
                        {{ posts[0].excerpt }}
                      </p>
                    }
                    <div class="flex items-center text-blue-100">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 11a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        ></path>
                      </svg>
                      <time>{{ formatDate(posts[0].publishedDate || posts[0].createdAt) }}</time>
                    </div>
                  </div>
                </div>
                <div class="md:w-1/2 p-8 bg-gray-50">
                  <div class="h-full flex items-center">
                    <div class="w-full">
                      <div
                        class="prose prose-gray max-w-none"
                        [innerHTML]="getExcerptHtml(posts[0])"
                      ></div>
                      <a
                        [routerLink]="['/post', posts[0].slug]"
                        class="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                        Read More
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          }
          <!-- Regular Posts Grid -->
          @if (posts.length > 1) {
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              @for (post of posts.slice(1); track trackByPostId($index, post)) {
                <article
                  class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                  <div class="p-6">
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 11a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        ></path>
                      </svg>
                      <time>{{ formatDate(post.publishedDate || post.createdAt) }}</time>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      <a
                        [routerLink]="['/post', post.slug]"
                        class="hover:text-blue-600 transition-colors"
                        >
                        {{ post.title }}
                      </a>
                    </h3>
                    @if (post.excerpt) {
                      <p class="text-gray-600 mb-4 line-clamp-3">
                        {{ post.excerpt }}
                      </p>
                    }
                    <a
                      [routerLink]="['/post', post.slug]"
                      class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                      Read More
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </article>
              }
            </div>
          }
          <!-- Empty State -->
          @if (posts.length === 0) {
            <div class="text-center py-16">
              <svg
                class="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h3 class="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
              <p class="text-gray-600">Check back later for new content!</p>
            </div>
          }
          <!-- Pagination -->
          @if (paginationData && paginationData.totalPages > 1) {
            <div
              class="flex justify-center mt-12"
              >
              <nav class="flex items-center space-x-1">
                @if (paginationData.hasPrevPage) {
                  <button
                    (click)="loadPosts(paginationData.prevPage!)"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    >
                    Previous
                  </button>
                }
                <span
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200"
                  >
                  Page {{ paginationData.page }} of {{ paginationData.totalPages }}
                </span>
                @if (paginationData.hasNextPage) {
                  <button
                    (click)="loadPosts(paginationData.nextPage!)"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    >
                    Next
                  </button>
                }
              </nav>
            </div>
          }
        </div>
      }
    </div>
    `,
  styles: [
    `
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  paginationData: any = null;
  isLoading = signal(false);
  error: string | null = null;

  constructor(private readonly blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(page: number = 1): void {
    this.isLoading.set(true);
    this.error = null;

    this.blogService.getPosts(page, 9).subscribe({
      next: (response: PayloadResponse<Post>) => {
        this.posts = response.docs;
        this.paginationData = {
          page: response.page,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
          nextPage: response.nextPage,
          prevPage: response.prevPage,
        };
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error = 'Failed to load posts. Please try again.';
        this.isLoading.set(false);
        console.error('Error loading posts:', error);
      },
    });
  }

  trackByPostId(index: number, post: Post): string {
    return `${post.id}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getExcerptHtml(post: Post): string {
    if (post.excerpt) {
      return `<p class="text-gray-600">${post.excerpt}</p>`;
    }
    return '<p class="text-gray-600">Click to read this post...</p>';
  }
}
