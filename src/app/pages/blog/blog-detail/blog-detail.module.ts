import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogDetailPageRoutingModule } from './blog-detail-routing.module';

import { BlogDetailPage } from './blog-detail.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [BlogDetailPage]
})
export class BlogDetailPageModule {}
