import { Component, OnInit, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo/Site Title -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">{{ siteSettings?.siteName || 'My Blog' }}</h1>
                <p class="text-sm text-gray-600 hidden sm:block">{{ siteSettings?.siteDescription || 'Sharing thoughts and ideas' }}</p>
              </div>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a routerLink="/"
               routerLinkActive="text-blue-600 border-blue-600"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
              Home
            </a>
            <a routerLink="/about"
               routerLinkActive="text-blue-600 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
              About
            </a>
            <a routerLink="/categories"
               routerLinkActive="text-blue-600 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
              Categories
            </a>
          </nav>

          <!-- Search & Mobile Menu -->
          <div class="flex items-center space-x-4">
            <!-- Search Button -->
            <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      [attr.d]="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div [class]="'md:hidden overflow-hidden transition-all duration-300 ' + (isMobileMenuOpen ? 'max-h-48 pb-4' : 'max-h-0')">
          <nav class="flex flex-col space-y-2 pt-2 border-t border-gray-200">
            <a routerLink="/"
               (click)="closeMobileMenu()"
               routerLinkActive="text-blue-600 bg-blue-50"
               [routerLinkActiveOptions]="{exact: true}"
               class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              Home
            </a>
            <a routerLink="/about"
               (click)="closeMobileMenu()"
               routerLinkActive="text-blue-600 bg-blue-50"
               class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              About
            </a>
            <a routerLink="/categories"
               (click)="closeMobileMenu()"
               routerLinkActive="text-blue-600 bg-blue-50"
               class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              Categories
            </a>
          </nav>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  private blogService = inject(BlogService);

  siteSettings: any = null;
  isMobileMenuOpen = false;

  ngOnInit(): void {
    this.loadSiteSettings();
  }

  private loadSiteSettings(): void {
    this.blogService.getSettings().subscribe({
      next: (settings) => {
        this.siteSettings = settings;
      },
      error: (error) => {
        console.error('Error loading site settings:', error);
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
