import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeHeroComponent } from './home-hero/home-hero.component';
import { HomeAboutComponent } from './home-about/home-about.component';
import { HomeServiceComponent } from './home-service/home-service.component';
import { HomeValuesComponent } from './home-values/home-values.component';
import { TranslateModule } from '@ngx-translate/core';
import { HomeBlogComponent } from './home-blog/home-blog.component';
import { HomeContactComponent } from './home-contact/home-contact.component';
import { HomeProcessComponent } from './home-process/home-process.component';
import { HomeDifferentialsComponent } from './home-differentials/home-differentials.component';
import { HomeTestimonialsComponent } from './home-testimonials/home-testimonials.component';
import { HomeFaqComponent } from './home-faq/home-faq.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    HomePage,
    HomeHeroComponent,
    HomeAboutComponent,
    HomeProcessComponent,
    HomeDifferentialsComponent,
    HomeTestimonialsComponent,
    HomeServiceComponent,
    HomeValuesComponent,
    HomeContactComponent,
    HomeBlogComponent,
    HomeFaqComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class HomePageModule {}
