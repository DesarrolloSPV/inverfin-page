import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../../shared/services/blog.service';
import { BlogPost } from '../../../../shared/models/blog';
import { BlogDetailPage } from '../../blog-detail/blog-detail.page';

@Component({
  selector: 'app-blog-publications',
  templateUrl: './blog-publications.component.html',
  styleUrls: ['./blog-publications.component.scss'],
  standalone: false
})
export class BlogPublicationsComponent implements OnInit, OnDestroy {
  posts: BlogPost[] = [];
  loading = true;
  private postsSub?: Subscription;

  // Propiedad para la barra de búsqueda
  searchTerm: string = '';

  // Paginación
  currentPage: number = 1;
  pageSize: number = 9;

  constructor(
    private blogService: BlogService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadPublishedPosts();
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
  }

  loadPublishedPosts() {
    this.loading = true;
    this.postsSub = this.blogService.getPublishedPosts().subscribe({
      next: (posts) => {
        this.zone.run(() => {
          this.posts = posts;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error al obtener los artículos publicados:', error);
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // 👈 Filtra los posts en tiempo real según el título, autor o extracto
  get filteredPosts(): BlogPost[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.posts;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.posts.filter((post) => {
      const titulo = post.titulo ? post.titulo.toLowerCase() : '';
      const autor = post.autor ? post.autor.toLowerCase() : '';
      const extracto = post.extracto ? post.extracto.toLowerCase() : '';
      return titulo.includes(term) || autor.includes(term) || extracto.includes(term);
    });
  }

  // Se ejecuta al escribir en el buscador para volver a la página 1
  onFilterChange() {
    this.currentPage = 1;
  }

  // Obtenemos los posts filtrados excluyendo el primero (Hero Card)
  get secondaryPosts(): BlogPost[] {
    return this.filteredPosts.slice(1);
  }

  // Obtenemos únicamente los 9 posts de la página actual
  get paginatedPosts(): BlogPost[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.secondaryPosts.slice(startIndex, startIndex + this.pageSize);
  }

  // Total de páginas calculadas
  get totalPages(): number {
    return Math.ceil(this.secondaryPosts.length / this.pageSize) || 1;
  }

  // Array de números de página para iterar [1, 2, 3...]
  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Cambiar a una página específica y hacer scroll suave hacia arriba
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  async openPostDetail(post: BlogPost) {
    const modal = await this.modalCtrl.create({
      component: BlogDetailPage,
      componentProps: { post },
      cssClass: 'blog-detail-modal'
    });
    await modal.present();
  }

  formatFecha(fecha: any): Date | null {
    if (!fecha) return null;
    if (typeof fecha.toDate === 'function') {
      return fecha.toDate();
    }
    return new Date(fecha);
  }
}
