import { Component, inject } from '@angular/core';
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
export class AppComponent {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);

  constructor() {
    this.initTranslate();
  }

  // Private functions
  // ===========================

  // Init SEO Listener
  private initSeo(): void {
    this.seoService.init(); // Arranca el router subscribe para páginas estáticas
  }

  // Init Translate Service
  initTranslate(): void {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.setTranslation('es', translationsES);
    this.translate.setTranslation('en', translationsEN);
    const currentLang = localStorage.getItem('language')
    if (currentLang && (currentLang === 'es' || currentLang === 'en')) {
      this.translate.use(currentLang);
    } else {
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/es|en/) ? browserLang : 'es');
    }
  }

  ngOnInit() {
  const gclid = new URLSearchParams(window.location.search).get('gclid');
  if (gclid) {
    try { localStorage.setItem('gclid', gclid); } catch {}
  }
  }
}
