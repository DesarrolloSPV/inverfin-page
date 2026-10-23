import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ModalController, ToastController } from '@ionic/angular';
import { BlogService } from '../../../../shared/services/blog.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { BlogPost } from '../../../../shared/models/blog';
import { Pagination } from '../../../../shared/models/utilities/pagination.model';
import { QueryFilter } from '../../../../shared/models/utilities/queryFilter.model';
import { BlogModalComponent } from '../blog-modal/blog-modal.component';
import { BlogDetailPage } from '../../../blog/blog-detail/blog-detail.page';

@Component({
  selector: 'app-blog-admin',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.scss'],
  standalone: false
})
export class BlogAdminComponent implements OnInit {

  paginatedPosts: BlogPost[] = [];
  pagination = new Pagination<BlogPost>();
  filters: QueryFilter<BlogPost>[] = [];

  // Filtros
  searchTerm: string = '';
  selectedStatus: string = 'all';

  pageSize: number = 10;
  isLoading: boolean = false;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private ngZone: NgZone,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPosts('next');
  }

  //* Consulta los artículos del blog desde Firestore aplicando paginación y filtros de estado.
  async cargarPosts(direction: 'next' | 'prev' = 'next') {
    this.isLoading = true;
    const filters: QueryFilter<BlogPost>[] = [];

    // Agrega el filtro según el estado seleccionado (publicado o borrador)
    if (this.selectedStatus === 'published') {
      filters.push({ fieldPath: 'publicado', relation: '==', data: true });
    } else if (this.selectedStatus === 'draft') {
      filters.push({ fieldPath: 'publicado', relation: '==', data: false });
    }

    // Search
    if (this.searchTerm) {
      const realSearch = this.searchTerm.trim().toLowerCase().split(' ');
      filters.push({ fieldPath: 'search', relation: 'array-contains-any', data: realSearch });
    }

    try {
      // Realiza la consulta paginada mediante el servicio de Firestore
      let results = await this.blogService.queryPage(
        this.pagination,
        direction,
        filters,
        this.pageSize,
        'fechaCreacion'
      );

      // Si hay un término de búsqueda, filtra los resultados obtenidos por título, autor o slug
      // if (this.searchTerm.trim() !== '') {
      //   const term = this.searchTerm.toLowerCase().trim();
      //   results = results.filter(post =>
      //     post.titulo?.toLowerCase().includes(term) ||
      //     post.autor?.toLowerCase().includes(term) ||
      //     post.slug?.toLowerCase().includes(term)
      //   );
      // }

      // Actualiza la vista de forma segura dentro de la zona de Angular
      this.ngZone.run(() => {
        this.paginatedPosts = results;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error al cargar posts paginados:', error);
      this.isLoading = false;
    }
  }

  /**
   * CAMBIO DE FILTROS
   * Se dispara cuando el usuario cambia el estado de publicación o el texto de búsqueda.
   * Reinicia el modelo de paginación a la primera página y vuelve a cargar los datos.
   */

  onFilterChange() {
    this.pagination.reset();
    this.cargarPosts('next');
  }

/**
   * CAMBIO DE PÁGINA
   * Controla la navegación hacia adelante o hacia atrás.
   * Valida que no se pueda retroceder si ya se está en la página 1 ni avanzar si se llegó al final.
   *
   * @param direction 'next' para avanzar a la siguiente página, 'prev' para regresar a la anterior
   */

  changePage(direction: 'next' | 'prev') {
    // Si queremos ir hacia atrás estando en la página 1 o menor, ignoramos la acción
    if (direction === 'prev' && this.pagination.page <= 1) {
      return;
    }

    // Si queremos ir hacia adelante estando en la última página, ignoramos la acción
    if (direction === 'next' && this.pagination.onLast) {
      return;
    }

    this.cargarPosts(direction);
  }

  //FORMATO DE FECHA
  formatFecha(fecha: any): Date | null {
    if (!fecha) return null;
    if (fecha.toDate && typeof fecha.toDate === 'function') {
      return fecha.toDate();
    }
    return new Date(fecha);
  }

  //Abre un modal con el componente `BlogDetailPage`
  async verVistaPrevia(post: BlogPost) {
    const modal = await this.modalCtrl.create({
      component: BlogDetailPage,
      componentProps: { post },
      cssClass: 'blog-preview-modal'
    });

    await modal.present();
  }

  // ABRIR MODAL DE CREACIÓN/EDICIÓN
  async onOpenModal(post?: BlogPost) {
    const modal = await this.modalCtrl.create({
      component: BlogModalComponent,
      componentProps: { post }
    });

    await modal.present();

    // Si la modal se cierra tras haber guardado cambios, reinicia la lista
    const { role } = await modal.onWillDismiss();
    if (role === 'saved') {
      this.onFilterChange();
    }
  }

  //ELIMINAR PUBLICACIÓN
  async onDeletePost(post: BlogPost) {
    if (!post.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el artículo "${post.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            try {
              await this.blogService.deletePost(post.id!);
              await loading.dismiss();
              this.presentToast('Artículo eliminado correctamente', 'success');
              this.onFilterChange();
            } catch (error) {
              await loading.dismiss();
              this.presentToast('Error al eliminar el artículo', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //CERRAR SESIÓN
  async onLogout() {
    try {
      await this.authService.logout();
      window.location.href = '/admin/login';
    } catch (error) {
      this.presentToast('Error al cerrar sesión', 'danger');
    }
  }

  //mostrar notificaciones flotantes en pantalla
  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
