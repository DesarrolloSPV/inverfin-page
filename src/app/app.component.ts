import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor() {
    this.initTranslate();
  }

  // Private functions
  // ===========================

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
}
