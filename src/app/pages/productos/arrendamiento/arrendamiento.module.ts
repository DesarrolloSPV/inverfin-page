import { ArrendamientoHomeComponent } from './arrendamiento-home/arrendamiento-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArrendamientoPageRoutingModule } from './arrendamiento-routing.module';

import { ArrendamientoPage } from './arrendamiento.page';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ArrendamientoBenefitsComponent } from './arrendamiento-benefits/arrendamiento-benefits.component';
import { ArrendamientoProcessComponent } from './arrendamiento-process/arrendamiento-process.component';
import { ArrendamientoProblemComponent } from './arrendamiento-problem/arrendamiento-problem.component';
import { ArrendamientoQuestionsComponent } from './arrendamiento-questions/arrendamiento-questions.component';
import { ArrendamientoContactComponent } from './arrendamiento-contact/arrendamiento-contact.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArrendamientoPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ArrendamientoPage,
    ArrendamientoHomeComponent,
    ArrendamientoBenefitsComponent,
    ArrendamientoProcessComponent,
    ArrendamientoProblemComponent,
    ArrendamientoQuestionsComponent,
    ArrendamientoContactComponent,

  ]
})
export class ArrendamientoPageModule {}
