import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { BlogService } from '../../../shared/services/blog.service';
import { SeoService } from '../../../shared/services/seo.service';
import { BlogPost } from '../../../shared/models/blog';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
  standalone: false
})
export class BlogDetailPage implements OnInit {

  @Input() post?: BlogPost;
  loading: boolean = false;
  isModal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private seoService: SeoService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    if (this.post) {
      this.isModal = true;
      if (this.post.id) {
        this.blogService.registrarVista(this.post.id).catch(err => console.error(err));
      }
      this.cdr.detectChanges();
      return;
    }

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loading = true;
      this.cargarPost(slug);
    }
  }

  cargarPost(slug: string) {
    this.blogService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;

        if (post) {
          this.setSeoTags(post);
          if (post.id) {
            this.blogService.registrarVista(post.id).catch(err => console.error(err));
          }
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el artículo:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private setSeoTags(post: BlogPost) {
    const baseUrl = 'https://inverfin.com.mx';
    const descripcion = post.extracto || post.titulo;
    const fechaISO = this.formatFecha(post.fechaCreacion)?.toISOString() || new Date().toISOString();
    const urlArticulo = `${baseUrl}/blog/${post.slug}`;

    // Tratamiento de la imagen para redes sociales (evitar SVG)
    let imagenFinal = post.imagenPortada || `${baseUrl}/assets/images/default-cover.jpg`;
    if (imagenFinal.endsWith('.svg')) {
      imagenFinal = imagenFinal.replace(/\.svg$/i, '.jpg');
    }
    if (!imagenFinal.startsWith('http')) {
      imagenFinal = `${baseUrl}${imagenFinal.startsWith('/') ? '' : '/'}${imagenFinal}`;
    }

    this.seoService.updateSeo({
      title: post.titulo,
      description: descripcion,
      image: imagenFinal,
      url: urlArticulo,
      type: 'article',
      author: post.autor || 'Inverfin',
      publishedTime: fechaISO,
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.titulo,
        'description': descripcion,
        'image': [imagenFinal],
        'datePublished': fechaISO,
        'author': {
          '@type': 'Person',
          'name': post.autor || 'Inverfin'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Inverfin',
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/assets/logo.png`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': urlArticulo
        }
      }
    });
  }

  goBack() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    } else {
      this.router.navigate(['/blog']);
    }
  }

  async compartirArticulo() {
    if (!this.post) return;

    const cleanSlug = encodeURIComponent(this.post.slug);
    const shareUrl = `${window.location.origin}/blog/${cleanSlug}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: this.post.titulo,
          text: `Te comparto este artículo de Inverfin: ${this.post.titulo}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Compartir cancelado', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const toast = await this.toastCtrl.create({
          message: '¡Enlace del artículo copiado al portapapeles!',
          duration: 2500,
          color: 'dark',
          position: 'bottom'
        });
        await toast.present();
      } catch (err) {
        console.error('Error al copiar el enlace:', err);
      }
    }
  }

  dismiss() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    }
  }

  formatFecha(fecha: any): Date | null {
    if (!fecha) return null;
    if (typeof fecha.toDate === 'function') {
      return fecha.toDate();
    }
    return new Date(fecha);
  }
}
