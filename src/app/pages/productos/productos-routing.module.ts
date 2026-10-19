import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPage } from './productos.page';
import { FactorajePage } from './factoraje/factoraje.page';
import { ArrendamientoPage } from './arrendamiento/arrendamiento.page';
import { SegurosPage } from './seguros/seguros.page';
import { SeoGuard } from '../../shared/guards/seo.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Nuestros Productos y Servicios | Inverfin',
        description: 'Descubre nuestras soluciones de arrendamiento puro, factoraje y seguros corporativos diseñadas a la medida de tu negocio.'
      }
    }
  },
  {
    path: 'arrendamiento',
    component: ArrendamientoPage,
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Arrendamiento Puro para Empresas | Inverfin',
        description: 'Rentas deducibles y renovación de equipo, maquinaria o flotillas sin descapitalizarte. Cotiza tu arrendamiento puro con Inverfin.',
        image: 'assets/img/og-arrendamiento.jpg'
      }
    }
  },
  {
    path: 'factoraje',
    component: FactorajePage,
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Factoraje Financiero y Liquidez Inmediata | Inverfin',
        description: 'Convierte tus facturas por cobrar en liquidez inmediata sin esperar 30, 60 o 90 días. Fortalece el flujo de caja de tu empresa.',
        image: 'assets/img/og-factoraje.jpg'
      }
    }
  },
  {
    path: 'seguros',
    component: SegurosPage,
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Seguros para Empresas, Flotillas y Personas | Inverfin Seguros',
        description: 'Comparamos opciones de varias aseguradoras para proteger tu empresa, flotilla, patrimonio y familia. Asesoría y acompañamiento en siniestros.',
        image: 'assets/img/og-seguros.jpg'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
