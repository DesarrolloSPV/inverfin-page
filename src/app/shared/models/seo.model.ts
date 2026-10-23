export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  // Soporte para datos estructurados Schema.org / JSON-LD
  schemaJson?: object;
  // Propiedades exclusivas para artículos
  author?: string;
  publishedTime?: string;
}
