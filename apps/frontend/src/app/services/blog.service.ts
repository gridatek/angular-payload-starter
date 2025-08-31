import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PayloadResponse } from 'types';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api';

  createPostsResource(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('where[status][equals]', 'published');

    return httpResource<PayloadResponse<Post>>(() => {
      return {
        url: `${this.apiUrl}/posts`,
        params: params,
      };
    });
  }

  createPostResource(slug: string | undefined) {

    if (!slug) {
      return undefined;
    }


    const params = new HttpParams().set('where[slug][equals]', slug).set('limit', '1');

    return httpResource<PayloadResponse<Post>>(() => {
      return {
        url: `${this.apiUrl}/posts`,
        params: params,
      };
    });
  }

  getCategories(): Observable<PayloadResponse<any>> {
    return this.http.get<PayloadResponse<any>>(`${this.apiUrl}/categories`);
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/globals/settings`);
  }
}
