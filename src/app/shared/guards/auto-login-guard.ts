import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !user), // Si NO hay usuario, permite ver la pantalla de Login (true)
      tap(noUser => {
        if (!noUser) {
          // Si YA HAY usuario, redirige inmediatamente a la administración
          this.router.navigate(['/admin/blog']);
        }
      })
    );
  }
}
