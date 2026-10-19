import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogManagerPage } from './blog-manager.page';

const routes: Routes = [
  {
    path: '',
    component: BlogManagerPage
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogManagerPageRoutingModule {}
