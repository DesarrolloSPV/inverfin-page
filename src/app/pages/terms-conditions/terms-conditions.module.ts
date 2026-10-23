import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsConditionsPageRoutingModule } from './terms-conditions-routing.module';

import { TermsConditionsPage } from './terms-conditions.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { TermsHeroComponent } from './terms-hero/terms-hero.component';
import { TermsDescriptionComponent } from './terms-description/terms-description.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    TermsConditionsPageRoutingModule
  ],
  declarations: [TermsConditionsPage,
    TermsHeroComponent,
    TermsDescriptionComponent,
  ]
})
export class TermsConditionsPageModule {}
