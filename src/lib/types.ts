export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  category: Category;
  author: Author;
  publishedAt: string;
  featured?: boolean;
  videoUrl?: string; // For YouTube video embeds
  comments?: Comment[];
}

export interface DbData {
    articles: Article[];
    categories: Category[];
}
