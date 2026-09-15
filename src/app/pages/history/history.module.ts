import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';
import { HistoryPage } from './history.page';
import { HistoryHeroComponent } from './history-hero/history-hero.component';
import { HistoryAboutComponent } from './history-about/history-about.component';
import { SharedModule } from '../../shared/shared.module'; // Para poder usar <app-header> y componentes de shared
import { HistoryValuesComponent } from './history-values/history-values.component';
import { HistoryProcessComponent } from './history-process/history-process.component';
import { HistoryDifferentialsComponent } from './history-differentials/history-differentials.component';
import { HistoryContactComponent } from './history-contact/history-contact.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [
    HistoryPage,
    HistoryHeroComponent,
    HistoryAboutComponent,
    HistoryValuesComponent,
    HistoryProcessComponent,
    HistoryDifferentialsComponent,
    HistoryContactComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class HistoryPageModule {}
