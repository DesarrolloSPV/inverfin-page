import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Agregado para Formularios

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

// Importaciones de Firebase
import { AngularFireModule } from '@angular/fire/compat'; // <-- Agregado
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // <-- Agregado
import { environment } from '../environments/environment'; // <-- Agregado

// Importaciones de ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}