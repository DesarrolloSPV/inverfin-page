import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosPageRoutingModule } from './productos-routing.module';

import { ProductosPage } from './productos.page';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ArrendamientoBenefitsComponent } from './arrendamiento/arrendamiento-benefits/arrendamiento-benefits.component';
import { ArrendamientoContactComponent } from './arrendamiento/arrendamiento-contact/arrendamiento-contact.component';
import { ArrendamientoHomeComponent } from './arrendamiento/arrendamiento-home/arrendamiento-home.component';
import { ArrendamientoPage } from './arrendamiento/arrendamiento.page';
import { ArrendamientoProblemComponent } from './arrendamiento/arrendamiento-problem/arrendamiento-problem.component';
import { ArrendamientoProcessComponent } from './arrendamiento/arrendamiento-process/arrendamiento-process.component';
import { ArrendamientoQuestionsComponent } from './arrendamiento/arrendamiento-questions/arrendamiento-questions.component';
import { FactorajePage } from './factoraje/factoraje.page';
import { FactorajeBenefitsComponent } from './factoraje/factoraje-benefits/factoraje-benefits.component';
import { FactorajeContactComponent } from './factoraje/factoraje-contact/factoraje-contact.component';
import { FactorajeHomeComponent } from './factoraje/factoraje-home/factoraje-home.component';
import { FactorajeProblemComponent } from './factoraje/factoraje-problem/factoraje-problem.component';
import { FactorajeProcessComponent } from './factoraje/factoraje-process/factoraje-process.component';
import { FactorajeQuestionsComponent } from './factoraje/factoraje-questions/factoraje-questions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    ProductosPage,
    ArrendamientoPage,
    ArrendamientoBenefitsComponent,
    ArrendamientoContactComponent,
    ArrendamientoHomeComponent,
    ArrendamientoProblemComponent,
    ArrendamientoProcessComponent,
    ArrendamientoQuestionsComponent,
    FactorajePage,
    FactorajeBenefitsComponent,
    FactorajeContactComponent,
    FactorajeHomeComponent,
    FactorajeProblemComponent,
    FactorajeProcessComponent,
    FactorajeQuestionsComponent,
  ],
})
export class ProductosPageModule {}
