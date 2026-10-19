import { Timestamp } from '@angular/fire/firestore';
import { Metadata } from './utilities/metadata.model';

export interface BlogPost extends Metadata {
  id?: string;
  uid?: string;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  imagenPortada: string;
  imagenPortadaPath?: string;
  autor: string;
  publicado: boolean;
  fechaCreacion?: Date | Timestamp | string;
  fechaActualizacion?: Date | Timestamp | string;
  tags: string[];
  vistasCount?: number;
}

export const PRESET_BLOG_IMAGES = [
  {
    id: 'predeterminada',
    label: 'Predeterminada',
    path: 'assets/img/blog/default-cover.jpg',
    icon: 'image-outline'
  },
  {
    id: 'arrendamiento',
    label: 'Arrendamiento',
    path: 'assets/img/blog/arrendamiento.jpg',
    icon: 'key-outline'
  },
  {
    id: 'factoraje',
    label: 'Factoraje',
    path: 'assets/img/blog/factoraje.jpg',
    icon: 'cash-outline'
  },
  {
    id: 'educacion',
    label: 'Tips / Educación',
    path: 'assets/img/blog/tips.jpg',
    icon: 'bulb-outline'
  }
];
