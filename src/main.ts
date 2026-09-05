import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { register } from 'swiper/element/bundle';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Registra los elementos <swiper-container> y <swiper-slide> en el navegador
register();
