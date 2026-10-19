import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  // Método para iniciar sesión con Email y Contraseña
  login(email: string, pass: string) {
    return this.afAuth.signInWithEmailAndPassword(email, pass);
  }

  // Método para cerrar sesión
  logout() {
    return this.afAuth.signOut();
  }
}
