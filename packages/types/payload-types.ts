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