import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';
import { AutoLoginGuard } from './shared/guards/auto-login-guard';
import { SeoGuard } from './shared/guards/seo.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    pathMatch: 'full',
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Arrendamiento Puro y Factoraje para Empresas | Inverfin',
        description: 'Arrendamiento puro y factoraje financiero para empresas y PFAE en México. Obtén liquidez y activos productivos sin descapitalizarte.'
      }
    }
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then( m => m.HistoryPageModule),
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Nuestra Historia | Inverfin',
        description: 'Conoce la trayectoria y valores de Inverfin impulsando proyectos.'
      }
    }
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Nuestros Productos y Servicios | Inverfin',
        description: 'Descubre nuestros productos financieros diseñados a tu medida.'
      }
    }
  },
  {
    path: 'aviso-privacidad',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule),
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Aviso de Privacidad | Inverfin',
        description: 'Consulta los términos sobre el tratamiento de tus datos personales.'
      }
    }
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then( m => m.TermsConditionsPageModule),
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Términos y Condiciones | Inverfin',
        description: 'Condiciones de uso de nuestra plataforma y servicios.'
      }
    }
  },

  // --- Rutas públicas del Blog ---
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog-list/blog-list.module').then( m => m.BlogListPageModule),
    canActivate: [SeoGuard],
    data: {
      seo: {
        title: 'Blog Financiero | Inverfin',
        description: 'Artículos, noticias y consejos de finanzas en el blog oficial de Inverfin.'
      }
    }
  },
  {
    path: 'blog/:slug',
    loadChildren: () => import('./pages/blog/blog-detail/blog-detail.module').then(m => m.BlogDetailPageModule)
    // Sin SeoGuard: BlogDetailPage gestiona su propio SEO dinámico desde Firebase
  },

  // --- Rutas del SGC (Administrador) ---
  {
    path: 'admin/login',
    loadChildren: () => import('./pages/admin/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'admin/blog',
    loadChildren: () => import('./pages/admin/blog-manager/blog-manager.module').then( m => m.BlogManagerPageModule),
    canActivate: [AuthGuard]
  },

  // Redirección por defecto
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
