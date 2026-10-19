import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SeoService } from '../services/seo.service';

@Injectable({
  providedIn: 'root'
})
export class SeoGuard implements CanActivate {

  constructor(private seoService: SeoService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // 1. Recorremos el árbol de rutas hacia abajo para encontrar la hija más profunda activa
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // 2. Si la ruta más profunda tiene datos de SEO, los actualizamos
    if (currentRoute.data && currentRoute.data['seo']) {
      this.seoService.updateSeo(currentRoute.data['seo']);
    }

    return true;
  }
}
