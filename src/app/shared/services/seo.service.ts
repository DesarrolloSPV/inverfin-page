import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SeoConfig } from '../models/seo.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultTitle = 'INVERFIN - Financial Services';
  private defaultDescription = 'Inverfin ofrece asesoría financiera, arrendamiento puro, factoraje y seguros corporativos.';
  private domainUrl = 'https://inverfin.com.mx';
  private defaultOgImage = 'https://inverfin.com.mx/assets/img/og-default.jpg';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(DOCUMENT) private dom: Document
  ) {
    // Escuchar el fin de cada navegación para garantizar URLs canónicas y og:url exactas y actualizadas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const cleanUrl = event.urlAfterRedirects.split('?')[0];
      const fullUrl = `${this.domainUrl}${cleanUrl}`;

      // Actualizar automáticamente la canónica y el og:url en cada cambio de ruta completado
      this.setCanonicalUrl(fullUrl);
      this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    });
  }

  // Método de inicialización (si lo sigues invocando en AppComponent o app.component.ts)
  init() {
    // Opcional si ya dependes del enrutamiento por NavigationEnd en el constructor
  }

  updateSeo(config: SeoConfig) {
    const title = config.title || this.defaultTitle;
    const description = config.description || this.defaultDescription;

    // Si la config trae una URL específica se respeta, si no, se toma la ruta actual limpia de la navegación
    const currentUrl = config.url || `${this.domainUrl}${this.router.url.split('?')[0]}`;
    const image = config.image ? (config.image.startsWith('http') ? config.image : `${this.domainUrl}/${config.image}`) : this.defaultOgImage;

    // 1. Título de la pestaña
    this.titleService.setTitle(title);

    // 2. Meta Descripción
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Open Graph
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: currentUrl });
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.metaService.updateTag({ property: 'og:image', content: image });

    // 4. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // 5. Etiqueta Canonical garantizada
    this.setCanonicalUrl(currentUrl);

    // 6. JSON-LD
    if (config.schemaJson) {
      this.setJsonLd(config.schemaJson);
    }
  }

  private setCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = this.dom.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(schema: object) {
    let script: HTMLScriptElement | null = this.dom.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = this.dom.createElement('script');
      script.type = 'application/ld+json';
      this.dom.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }
}
