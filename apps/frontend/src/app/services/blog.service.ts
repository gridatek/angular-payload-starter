import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  publishedDate?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1, limit: number = 10): Observable<PayloadResponse<Post>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('where[status][equals]', 'published');

    return this.http.get<PayloadResponse<Post>>(`${this.apiUrl}/posts`, { params });
  }

  getPost(slug: string): Observable<PayloadResponse<Post>> {
    const params = new HttpParams()
      .set('where[slug][equals]', slug)
      .set('limit', '1');

    return this.http.get<PayloadResponse<Post>>(`${this.apiUrl}/posts`, { params });
  }

  getCategories(): Observable<PayloadResponse<any>> {
    return this.http.get<PayloadResponse<any>>(`${this.apiUrl}/categories`);
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/globals/settings`);
  }
}
