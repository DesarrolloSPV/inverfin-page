import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { BlogPost } from '../models/blog';
import { Pagination } from '../models/utilities/pagination.model';
import { QueryFilter } from '../models/utilities/queryFilter.model';
import { UtilitiesService } from './utilities.service';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private collectionName = 'blogs';
  private postsCollection: AngularFirestoreCollection<BlogPost>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private utilities: UtilitiesService,
    private injector: EnvironmentInjector,
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {
    this.postsCollection = this.afs.collection<BlogPost>(this.collectionName);
  }

  private getTime(fecha: any): number {
    if (!fecha) return 0;
    if (typeof fecha.toDate === 'function') {
      return fecha.toDate().getTime();
    }
    return new Date(fecha).getTime() || 0;
  }

  // =========================================================================
  // CONSULTAS PAGINADAS Y FILTRADAS CON UtilitiesService
  // =========================================================================

  async queryPage(
    pagination: Pagination<BlogPost>,
    direction: 'next' | 'prev' = 'next',
    filters: QueryFilter<BlogPost>[] = [],
    limit = 10,
    orderByField = 'fechaCreacion'
  ): Promise<BlogPost[]> {
    return runInInjectionContext(this.injector, async () => {
      let query: firebase.firestore.Query<BlogPost> = this.afs.collection<BlogPost>(this.collectionName).ref.limit(limit);

      if (direction === 'next') {
        query = query.orderBy(orderByField, 'desc');
        if (pagination.last) {
          query = query.startAfter(pagination.last);
        }
      } else if (direction === 'prev') {
        query = query.orderBy(orderByField, 'asc');
        if (pagination.start) {
          query = query.startAfter(pagination.start);
        }
      }

      for (const filter of filters) {
        query = query.where(filter.fieldPath, filter.relation, filter.data);
      }

      const snaps = await query.get();

      if (snaps.empty) {
        return [];
      }

      const adaptedSnaps = {
        ...snaps,
        docs: snaps.docs.map((doc) => ({
          ...doc,
          data: () => ({ ...doc.data(), uid: doc.id })
        }))
      } as any;

      this.utilities.processPagination(pagination as any, adaptedSnaps, direction, limit);

      let docs = [...snaps.docs];
      if (direction === 'prev') {
        docs.reverse();
      }

      return docs.map((snap) => {
        return { ...snap.data(), id: snap.id } as BlogPost;
      });
    });
  }

  async queryAll(filters: QueryFilter<BlogPost>[] = []): Promise<BlogPost[]> {
    return runInInjectionContext(this.injector, async () => {
      let query: firebase.firestore.Query<BlogPost> = this.afs.collection<BlogPost>(this.collectionName).ref;

      for (const filter of filters) {
        query = query.where(filter.fieldPath, filter.relation, filter.data);
      }

      const snaps = await query.get();
      return snaps.docs.map((snap) => {
        return { ...snap.data(), id: snap.id } as BlogPost;
      });
    });
  }

  // =========================================================================
  // STORAGE & CRUD EXISTENTES
  // =========================================================================

  uploadImage(file: File): Promise<{ url: string; path: string }> {
    return runInInjectionContext(this.injector, () => {
      const filePath = `blogs/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      return new Promise((resolve, reject) => {
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe({
              next: (url) => resolve({ url, path: filePath }),
              error: (err) => reject(err)
            });
          })
        ).subscribe();
      });
    });
  }

  deleteImageByPath(storagePath: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      if (!storagePath) return Promise.resolve();
      return this.storage.ref(storagePath).delete().toPromise();
    });
  }

  getPosts(): Observable<BlogPost[]> {
    return this.postsCollection.valueChanges({ idField: 'id' }).pipe(
      map(posts => posts.sort((a, b) => {
        const dateA = this.getTime(a.fechaCreacion);
        const dateB = this.getTime(b.fechaCreacion);
        return dateB - dateA;
      }))
    );
  }

  async isSlugUnique(slug: string, currentPostId?: string): Promise<boolean> {
    return runInInjectionContext(this.injector, async () => {
      const snapshot = await this.afs.collection<BlogPost>(this.collectionName, ref =>
        ref.where('slug', '==', slug)
      ).get().toPromise();

      if (!snapshot || snapshot.empty) return true;

      if (currentPostId) {
        const matchingDocs = snapshot.docs.filter(doc => doc.id !== currentPostId);
        return matchingDocs.length === 0;
      }

      return false;
    });
  }

  createPost(post: Omit<BlogPost, 'id'>) {
    return runInInjectionContext(this.injector, () => {
      return this.postsCollection.add({
        ...post,
        fechaCreacion: new Date(),
        publicado: post.publicado ?? true
      });
    });
  }

  updatePost(id: string, post: Partial<BlogPost>) {
    return runInInjectionContext(this.injector, () => {
      return this.afs.doc<BlogPost>(`${this.collectionName}/${id}`).update({
        ...post,
        fechaActualizacion: new Date()
      });
    });
  }

  deletePost(id: string) {
    return runInInjectionContext(this.injector, () => {
      return this.afs.doc<BlogPost>(`${this.collectionName}/${id}`).delete();
    });
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    return runInInjectionContext(this.injector, () => {
      return this.afs.collection<BlogPost>(this.collectionName, ref =>
        ref.where('slug', '==', slug).limit(1)
      ).valueChanges({ idField: 'id' }).pipe(
        map(posts => posts[0])
      );
    });
  }

  getPublishedPosts(): Observable<BlogPost[]> {
    return runInInjectionContext(this.injector, () => {
      return this.afs.collection<BlogPost>(this.collectionName, ref =>
        ref.where('publicado', '==', true)
      ).valueChanges({ idField: 'id' }).pipe(
        map(posts => posts.sort((a, b) => {
          const dateA = this.getTime(a.fechaCreacion);
          const dateB = this.getTime(b.fechaCreacion);
          return dateB - dateA;
        }))
      );
    });
  }

  // =========================================================================
  // Contador de vistas
  // =========================================================================

// Registra la vista aplicando la regla de las 24 horas de forma totalmente segura
async registrarVista(postId: string): Promise<void> {
  try {
    // 1. Obtener la IP pública (fuera del contexto de inyección, usando HttpClient obtenido por inyector)
    const http = this.injector.get(HttpClient);
    const response: any = await firstValueFrom(
      http.get('https://api.ipify.org?format=json')
    );
    const ip = response?.ip || 'unknown';
    if (ip === 'unknown') return;

    const ipDocId = ip.replace(/\./g, '_');

    // 2. Usamos el cliente nativo de Firestore (afs.firestore) para evitar llamadas a inject() tras el await
    const db = this.afs.firestore;
    const vistaRef = db.collection('blogs').doc(postId).collection('vistas').doc(ipDocId);

    const vistaDoc = await vistaRef.get();
    const ahora = new Date().getTime();

    if (vistaDoc.exists) {
      const data = vistaDoc.data() as { ultimaVisita?: any };
      const ultimaVisitaTime = data.ultimaVisita?.toDate().getTime() || 0;
      const horasTranscurridas = (ahora - ultimaVisitaTime) / (1000 * 60 * 60);

      // Si no han pasado 24 horas, no sumamos vista
      if (horasTranscurridas < 24) {
        return;
      }
    }

    // Guardamos/Actualizamos el registro con la fecha actual
    await vistaRef.set({
      ip: ip,
      ultimaVisita: new Date()
    });

    // 3. Transacción atómica usando el SDK nativo
    const postRef = db.collection('blogs').doc(postId);
    await db.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) return;

      const data = postDoc.data() as { vistasCount?: number };
      const currentViews = data?.vistasCount || 0;
      transaction.update(postRef, { vistasCount: currentViews + 1 });
    });

  } catch (error) {
    console.error('Error al registrar la vista por IP:', error);
  }
}
}

