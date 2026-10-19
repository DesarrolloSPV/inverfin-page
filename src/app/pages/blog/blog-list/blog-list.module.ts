import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BlogListPageRoutingModule } from './blog-list-routing.module';
import { BlogListPage } from './blog-list.page';

// Importa el módulo o componente de tu página de detalle
import { BlogDetailPageModule } from '../blog-detail/blog-detail.module';
import { SharedModule } from '../../../shared/shared.module';
import { BlogPublicationsComponent } from './blog-publications/blog-publications.component';
import { BlogHeroComponent } from './blog-hero/blog-hero.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BlogListPageRoutingModule,
    BlogDetailPageModule,
    SharedModule,
  ],
  declarations: [BlogListPage,
    BlogPublicationsComponent,
    BlogHeroComponent,
  ]
})
export class BlogListPageModule {}
