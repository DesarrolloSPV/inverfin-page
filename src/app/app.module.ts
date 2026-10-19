import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, Title, Meta } from '@angular/platform-browser'; // <-- Agregados Title y Meta
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Agregado para Formularios

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

// Importaciones de Firebase
import { AngularFireModule } from '@angular/fire/compat'; // <-- Agregado
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/compat/firestore'; // <-- Agregado
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // <--
import { environment } from '../environments/environment'; // <-- Agregado

// Importaciones de ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Servicio SEO
import { SeoService } from './shared/services/seo.service'; // <-- Ajusta la ruta según la ubicación de tu servicio

// Creador del cargador de traducciones
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule, // <-- Módulo de Formularios
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase), // <-- Inicializador de Firebase
    AngularFirestoreModule, // <-- Módulo de Firestore
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SETTINGS, useValue: {} },
    Title,      // <-- Provider para actualizar el <title> de la página
    Meta,       // <-- Provider para manipular las metaetiquetas y Open Graph
    SeoService, // <-- SeoService registrado como Provider global
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
