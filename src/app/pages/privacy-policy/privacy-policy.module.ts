import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPage } from './privacy-policy.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { PolicyHeroComponent } from './policy-hero/policy-hero.component';
import { PolicyDescriptionComponent } from './policy-description/policy-description.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    PrivacyPolicyPageRoutingModule
  ],
  declarations: [PrivacyPolicyPage,
    PolicyHeroComponent,
    PolicyDescriptionComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class PrivacyPolicyPageModule {}
