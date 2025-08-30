import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p class="text-xl text-gray-600">Learn more about our story and mission</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 sm:p-12">
          <div class="prose prose-lg max-w-none">
            <p class="lead text-gray-600 text-xl mb-8">
              Welcome to our blog, where we share insights, tutorials, and thoughts about web development, technology, and the digital world.
            </p>

            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p>
              We believe in the power of sharing knowledge and building a community of learners. Our goal is to provide high-quality content that helps developers and tech enthusiasts stay up-to-date with the latest trends and best practices.
            </p>

            <h2 class="text-2xl font-bold text-gray-900 mb-4">What We Cover</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li>Web Development (Frontend & Backend)</li>
              <li>JavaScript, TypeScript, and Modern Frameworks</li>
              <li>Cloud Computing and DevOps</li>
              <li>Software Architecture and Design Patterns</li>
              <li>Career Advice for Developers</li>
              <li>Industry News and Trends</li>
            </ul>

            <h2 class="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p>
              Have questions or suggestions? We'd love to hear from you! Feel free to reach out through our social media channels or drop us a message.
            </p>
          </div>
        </div>
      </div>

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
export class AboutComponent {}
