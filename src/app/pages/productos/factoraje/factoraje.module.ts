import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactorajePageRoutingModule } from './factoraje-routing.module';

import { FactorajePage } from './factoraje.page';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FactorajeHomeComponent } from './factoraje-home/factoraje-home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactorajePageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [FactorajePage,
    FactorajeHomeComponent,
  ]
})
export class FactorajePageModule {}
