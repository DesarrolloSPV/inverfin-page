import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPage } from './productos.page';
import { FactorajePage } from './factoraje/factoraje.page';
import { ArrendamientoPage } from './arrendamiento/arrendamiento.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  },
  {
    path: 'arrendamiento',
    component: ArrendamientoPage,
  },
  {
    path: 'factoraje',
    component: FactorajePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
