import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogManagerPageRoutingModule } from './blog-manager-routing.module';

import { BlogManagerPage } from './blog-manager.page';
import { SharedModule } from '../../../shared/shared.module';
import { BlogAdminComponent } from './blog-admin/blog-admin.component';
import { BlogModalComponent } from './blog-modal/blog-modal.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BlogManagerPageRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
  ],
  declarations: [BlogManagerPage,
    BlogAdminComponent,
    BlogModalComponent,
  ]
})
export class BlogManagerPageModule {}
