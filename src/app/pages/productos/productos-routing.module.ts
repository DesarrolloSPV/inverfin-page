import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  },
  {
    path: 'arrendamiento',
    loadChildren: () => import('./arrendamiento/arrendamiento.module').then( m => m.ArrendamientoPageModule)
  },
  {
    path: 'factoraje',
    loadChildren: () => import('./factoraje/factoraje.module').then( m => m.FactorajePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
