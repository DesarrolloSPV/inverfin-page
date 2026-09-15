import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FactorajePage } from './factoraje.page';

const routes: Routes = [
  {
    path: '',
    component: FactorajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactorajePageRoutingModule {}
