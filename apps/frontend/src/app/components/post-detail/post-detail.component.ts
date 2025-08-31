import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { Post } from 'types';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-detail',
  imports: [RouterModule],
  template: `
    <!-- Loading State -->
    @if (isLoading()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading post...</p>
        </div>
      </div>
    }
    
    <!-- Error State -->
    @if (error()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center max-w-md mx-auto px-4">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error() }}</p>
          <a routerLink="/" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    }
    
    <!-- Post Content -->
    @if (post() && !isLoading() && !error()) {
      <article class="min-h-screen">
        <!-- Hero Section -->
        <header class="bg-linear-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16 lg:py-24">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
              <!-- Breadcrumb -->
              <nav class="mb-8">
                <ol class="flex items-center justify-center space-x-2 text-sm">
                  <li>
                    <a routerLink="/" class="text-gray-300 hover:text-white transition-colors">Home</a>
                  </li>
                  <li class="text-gray-500">/</li>
                  <li class="text-gray-100">{{ post()?.title }}</li>
                </ol>
              </nav>
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {{ post()?.title }}
              </h1>
              <div class="flex items-center justify-center space-x-6 text-gray-300 mb-8">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 11a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"></path>
                  </svg>
                  <time>{{ formatDate(post()?.publishedDate || post()?.createdAt!) }}</time>
                </div>
                @if (readingTime()) {
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ readingTime() }} min read</span>
                  </div>
                }
                <div class="flex items-center">
                  <span class="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-200 text-sm font-medium rounded-full">
                    {{ post()?.status === 'published' ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </div>
              @if (post()?.excerpt) {
                <p class="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  {{ post()?.excerpt }}
                </p>
              }
            </div>
          </div>
        </header>
        <!-- Article Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="px-6 sm:px-10 lg:px-12 py-8 sm:py-12">
              <!-- Content -->
              <div class="prose prose-lg prose-blue max-w-none"
                [innerHTML]="getContentHtml()">
              </div>
              <!-- Article Footer -->
              <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">
                    Last updated: {{ formatDate(post()?.updatedAt!) }}
                  </div>
                  <!-- Share Buttons -->
                  <div class="flex items-center space-x-3">
                    <span class="text-sm text-gray-500 mr-3">Share:</span>
                    <button
                      (click)="shareOnTwitter()"
                      class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on Twitter">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button
                      (click)="shareOnLinkedIn()"
                      class="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on LinkedIn">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button
                      (click)="copyUrl()"
                      class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Copy URL">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </div>
          <!-- Navigation -->
          <nav class="mt-12 flex justify-between">
            <a routerLink="/"
              class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Posts
            </a>
            <button
              (click)="scrollToTop()"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
              Back to Top
            </button>
          </nav>
        </div>
      </article>
    }
    
    <!-- Toast Notification for URL Copy -->
    @if (showCopyToast) {
      <div
        class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          URL copied to clipboard!
        </div>
      </div>
    }
    `,
  styles: [`
    .prose {
      color: #374151;
      line-height: 1.75;
    }

    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      color: #111827;
      font-weight: 600;
      line-height: 1.25;
      margin-top: 2em;
      margin-bottom: 1em;
    }

    .prose h1 { font-size: 2.25em; }
    .prose h2 { font-size: 1.875em; }
    .prose h3 { font-size: 1.5em; }
    .prose h4 { font-size: 1.25em; }

    .prose p {
      margin-bottom: 1.25em;
    }

    .prose a {
      color: #2563eb;
      text-decoration: underline;
      font-weight: 500;
    }

    .prose a:hover {
      color: #1d4ed8;
    }

    .prose ul, .prose ol {
      padding-left: 1.625em;
      margin-bottom: 1.25em;
    }

    .prose li {
      margin-bottom: 0.5em;
    }

    .prose blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1em;
      font-style: italic;
      color: #6b7280;
      margin: 1.5em 0;
    }

    .prose code {
      background-color: #f3f4f6;
      padding: 0.125em 0.25em;
      border-radius: 0.25rem;
      font-size: 0.875em;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      color: #ef4444;
    }

    .prose pre {
      background-color: #1f2937;
      color: #f9fafb;
      border-radius: 0.5rem;
      padding: 1rem;
      overflow-x: auto;
      margin: 1.5em 0;
    }

    .prose pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }

    .prose img {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin: 2em auto;
    }

    .prose table {
      width: 100%;
      border-collapse: collapse;
      margin: 2em 0;
    }

    .prose th, .prose td {
      border: 1px solid #e5e7eb;
      padding: 0.75em;
      text-align: left;
    }

    .prose th {
      background-color: #f9fafb;
      font-weight: 600;
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);

  // Create a signal for the slug
  slug = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('slug')),
      filter(slug => slug !== null)
    )
  );

  private readonly postResource = this.blogService.createPostResource(this.slug());

  post = computed(() => this.postResource?.value()?.docs[0]);
  isLoading = computed(() => this.postResource?.isLoading());
  error = computed(() => this.postResource?.error());
  readingTime = computed(() => {




    if (!this.post()?.content) return;

    // Estimate reading time based on content
    const contentText = this.extractTextFromContent(this.post()?.content);
    const wordsPerMinute = 200;
    const wordCount = contentText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));







  });

  showCopyToast = false;
  // private destroy$ = new Subject<void>();

  // ngOnInit(): void {
  //   this.route.paramMap
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(params => {
  //       const slug = params.get('slug');
  //       if (slug) {
  //         this.loadPost(slug);
  //       }
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  // private loadPost(slug: string): void {
  //   this.isLoading = true;
  //   this.error = null;

  //   this.blogService.getPost(slug).subscribe({
  //     next: (response) => {
  //       if (response.docs && response.docs.length > 0) {
  //         this.post = response.docs[0];
  //         this.calculateReadingTime();
  //       } else {
  //         this.error = 'The requested post could not be found.';
  //       }
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       this.error = 'Failed to load the post. Please try again.';
  //       this.isLoading = false;
  //       console.error('Error loading post:', error);
  //     }
  //   });
  // }

  // private calculateReadingTime(): void {
  //   if (!this.post?.content) return;

  //   // Estimate reading time based on content
  //   const contentText = this.extractTextFromContent(this.post.content);
  //   const wordsPerMinute = 200;
  //   const wordCount = contentText.split(/\s+/).length;
  //   this.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  // }

  private extractTextFromContent(content: any): string {
    if (typeof content === 'string') {
      return content.replace(/<[^>]*>/g, '');
    }
    if (content && content.root && content.root.children) {
      return this.extractTextFromLexical(content.root.children);
    }
    return '';
  }

  private extractTextFromLexical(children: any[]): string {
    let text = '';
    for (const child of children) {
      if (child.type === 'text') {
        text += child.text + ' ';
      } else if (child.children) {
        text += this.extractTextFromLexical(child.children);
      }
    }
    return text;
  }

  getContentHtml(): string {
    if (!this.post()?.content) {
      return '<p class="text-gray-500 italic">No content available.</p>';
    }

    if (typeof this.post()?.content === 'string') {
      return this.post()?.content?? '';
    }

    // Handle Lexical editor format
    // if (this.post.content.root && this.post.content.root.children) {
    //   return this.convertLexicalToHtml(this.post.content.root.children);
    // }

    return '<p class="text-gray-500 italic">Unable to display content.</p>';
  }

  private convertLexicalToHtml(children: any[]): string {
    let html = '';

    for (const node of children) {
      switch (node.type) {
        case 'paragraph':
          html += `<p>${this.convertLexicalToHtml(node.children || [])}</p>`;
          break;
        case 'heading':
          const level = node.tag || 'h2';
          html += `<${level}>${this.convertLexicalToHtml(node.children || [])}</${level}>`;
          break;
        case 'text':
          let text = node.text || '';
          if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`;
            if (node.format & 2) text = `<em>${text}</em>`;
            if (node.format & 4) text = `<u>${text}</u>`;
            if (node.format & 8) text = `<s>${text}</s>`;
            if (node.format & 16) text = `<code>${text}</code>`;
          }
          html += text;
          break;
        case 'list':
          const listTag = node.listType === 'number' ? 'ol' : 'ul';
          html += `<${listTag}>${this.convertLexicalToHtml(node.children || [])}</${listTag}>`;
          break;
        case 'listitem':
          html += `<li>${this.convertLexicalToHtml(node.children || [])}</li>`;
          break;
        case 'link':
          html += `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${this.convertLexicalToHtml(node.children || [])}</a>`;
          break;
        case 'quote':
          html += `<blockquote>${this.convertLexicalToHtml(node.children || [])}</blockquote>`;
          break;
        case 'code':
          html += `<pre><code>${node.text || ''}</code></pre>`;
          break;
        default:
          if (node.children) {
            html += this.convertLexicalToHtml(node.children);
          }
      }
    }

    return html;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  shareOnTwitter(): void {
    if (!this.post) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${this.post()?.title}`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }

  shareOnLinkedIn(): void {
    if (!this.post) return;

    const url = encodeURIComponent(window.location.href);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  }

  async copyUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showCopyToast = true;

      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showCopyToast = false;
      }, 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
