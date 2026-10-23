import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './shared/services/seo.service';
import translationsEN from '../assets/i18n/en.json';
import translationsES from '../assets/i18n/es.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);

  constructor() {
    this.initTranslate();
  }

  ngOnInit(): void {
    this.saveClickId();
  }

  // Private functions
  // ===========================

  // Init SEO Listener
  private initSeo(): void {
    this.seoService.init(); // Arranca el router subscribe para páginas estáticas
  }

  // Init Translate Service: español por defecto; inglés solo si el usuario lo eligió
  private initTranslate(): void {
    this.translate.addLangs(['es', 'en']);
    this.translate.setTranslation('es', translationsES);
    this.translate.setTranslation('en', translationsEN);
    this.translate.setDefaultLang('es');

    let lang: 'es' | 'en' = 'es';
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'es' || saved === 'en') lang = saved;
    } catch {}

    this.translate.use(lang);
    document.documentElement.lang = lang;
  }

  // Guarda el gclid de Google Ads para atribuir la conversión del formulario
  private saveClickId(): void {
    const gclid = new URLSearchParams(window.location.search).get('gclid');
    if (gclid) {
      try { localStorage.setItem('gclid', gclid); } catch {}
    }
  }
}
