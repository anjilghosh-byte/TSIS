export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
  category?: 'weather' | 'closure' | 'safety' | 'tourism' | 'general';
  isOfficialWarning?: boolean;
}

export interface NewsData {
  articles: NewsArticle[];
  status: 'success' | 'empty' | 'error';
  errorMessage?: string;
  isDemoData?: boolean;
}
