import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeHeroComponent } from './home-hero/home-hero.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslatePipe,
    SharedModule,
  ],
  declarations: [
    HomePage,
    HomeHeroComponent,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class HomePageModule {}
