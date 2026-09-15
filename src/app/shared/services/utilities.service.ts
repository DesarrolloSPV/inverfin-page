/* eslint-disable @angular-eslint/prefer-inject */
import { inject, Injectable } from '@angular/core';
import { AlertController, LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { PopInfoComponent } from '../components/pop-info/pop-info.component';
import { HttpHeaders } from '@angular/common/http';
import firebase from 'firebase/compat/app';
import { Pagination } from '../models/utilities/pagination.model';
import { QuerySnapshot } from '@angular/fire/compat/firestore';
import { DateTime } from 'luxon';
import { MexicoStatesByCP } from '../utilities/mexico-estates-cp';
import { Timestamp } from '@angular/fire/firestore';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  // Services
  auth = inject(AngularFireAuth);

  // Regular Expressions
  emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  phoneRegExp = /^\d{10}$/;
  urlRegExp = /^(https?|ftp):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:[0-9]{1,5})?(\/[^\s]*)?$/;
  regExpPhoneLada = /^\+?(\d{1,4})\s?(\d{7,10})$/;


  constructor(
    private alertC: AlertController,
    private toastC: ToastController,
    private loadingC: LoadingController,
    private translate: TranslateService,
    private popC: PopoverController
  ) {}

  arraySearch(str: string): string[] {
    const minLength = 3;
    str = this.stringToSearchString(str);
    const array: string[] = [];
    for (const s of str.split(' ')) {
      if (s.length > minLength) {
        for (let i = s.length; i >= minLength; i--) {
          array.push(s.substring(0, i));
        }
      } else {
        array.push(s);
      }
    }
    return array;
  }

  async errorAlert(message = 'messages.error-catch'): Promise<void> {
    const top = await this.alertC.getTop();
    if (top) return;
    const alert = await this.alertC.create({
      cssClass: 'text',
      header: this.translate.instant('common.alert'),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'ok',
        },
      ],
    });
    await alert.present();
  }

  async errorToast(duration = 1500): Promise<void> {
    const toast = await this.toastC.create({
      message: this.translate.instant('messages.error-catch'),
      duration,
    });
    await toast.present();
    return;
  }

  async getUrlToBase64(url: string): Promise<string | null> {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const result = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            const resut = reader.result as string;
            resolve(resut.replace('data:application/json;', 'data:image/png;'));
          },
          false
        );
        reader.onerror = () => {
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
      return result;
    } else {
      return null;
    }
  }

  async normalAlert(message: string): Promise<void> {
    const alert = await this.alertC.create({
      cssClass: 'text',
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'ok',
        },
      ],
    });
    await alert.present();
  }

  async normalLoading(message = 'common.loading'): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingC.create({
      message: `${this.translate.instant(message)}...`,
    });
    await loading.present();
    return loading;
  }

  async normalToast(message: string, duration: number = 1500): Promise<void> {
    const toast = await this.toastC.create({
      message: this.translate.instant(message),
      duration,
      position: 'bottom',
    });
    await toast.present();
  }

  sortArray<T>(array: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): Array<T> {
    const newArray: T[] = [...array];
    if (newArray.length > 0 && newArray[0][field]) {
      newArray.sort((a, b) => {
        if (a[field] > b[field]) {
          if (order === 'asc') {
            return 1;
          } else {
            return -1;
          }
        } else if (a[field] < b[field]) {
          if (order === 'asc') {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      });
    }
    return newArray;
  }

  stringToSearchString(s: string): string {
    s = s.toLowerCase();
    s = s.split(new RegExp(/\s+/g)).join(' ');
    s = s.split(new RegExp(/[àáâãäå]/g)).join('a');
    s = s.split(new RegExp(/æ/g)).join('ae');
    s = s.split(new RegExp(/ç/g)).join('c');
    s = s.split(new RegExp(/[èéêë]/g)).join('e');
    s = s.split(new RegExp(/[ìíîï]/g)).join('i');
    s = s.split(new RegExp(/ñ/g)).join('n');
    s = s.split(new RegExp(/[òóôõö]/g)).join('o');
    s = s.split(new RegExp(/œ/g)).join('oe');
    s = s.split(new RegExp(/[ùúûü]/g)).join('u');
    s = s.split(new RegExp(/[ýÿ]/g)).join('y');
    s = s.split(new RegExp(/\W/g)).join(' ');
    return s;
  }

  stringToFirebaseRoot(s: string): string {
    s = s.split('.').join('');
    s = s.split('$').join('');
    s = s.split('#').join('');
    s = s.split('[').join('');
    s = s.split(']').join('');
    s = s.split('/').join('');
    s = s.split('☺').join('');
    s = s.split('☻').join('');
    s = s.split('♥').join('');
    s = s.split('♦').join('');
    s = s.split('♣').join('');
    s = s.split('♠').join('');
    s = s.split('•').join('');
    s = s.split('◘').join('');
    s = s.split('○').join('');
    s = s.split('◙').join('');
    s = s.split('♀').join('');
    s = s.split('♪').join('');
    s = s.split('♫').join('');
    s = s.split('☼').join('');
    s = s.split('►').join('');
    s = s.split('◄').join('');
    s = s.split('↕').join('');
    s = s.split('‼').join('');
    s = s.split('¶').join('');
    s = s.split('§').join('');
    s = s.split('▬').join('');
    s = s.split('↨').join('');
    s = s.split('↑').join('');
    s = s.split('↓').join('');
    s = s.split('→').join('');
    s = s.split('←').join('');
    s = s.split('∟').join('');
    s = s.split('↔').join('');
    s = s.split('▲').join('');
    s = s.split('▼').join('');
    s = s.split('⌂').join('');
    s = s.split(new RegExp(/\s+/g)).join(' ');
    s = s.split(new RegExp(/[àáâãäå]/g)).join('a');
    s = s.split(new RegExp(/æ/g)).join('ae');
    s = s.split(new RegExp(/ç/g)).join('c');
    s = s.split(new RegExp(/[èéêë]/g)).join('e');
    s = s.split(new RegExp(/[ìíîï]/g)).join('i');
    s = s.split(new RegExp(/ñ/g)).join('n');
    s = s.split(new RegExp(/[òóôõö]/g)).join('o');
    s = s.split(new RegExp(/œ/g)).join('oe');
    s = s.split(new RegExp(/[ùúûü]/g)).join('u');
    s = s.split(new RegExp(/[ýÿ]/g)).join('y');
    return s;
  }

  styleScrollbars(elmt: HTMLElement): void {
    const stylesheet = `
      ::-webkit-scrollbar {
        width: 8px;
        background: #FBFCFB;
      }
      ::-webkit-scrollbar-thumb {
        background: #2a7a8c;
        border-radius: 8px;
      }
    `;
    if (elmt && elmt.shadowRoot) {
      const styleElmt = elmt.shadowRoot.querySelector('style');
      if (styleElmt) {
        styleElmt.append(stylesheet);
      } else {
        const barStyle = document.createElement('style');
        barStyle.append(stylesheet);
        elmt.shadowRoot.appendChild(barStyle);
      }
    }
  }

  timeSince(date: Date): string {
    const nowSeconds = new Date().getTime() / 1000;
    const thenSeconds = date.getTime() / 1000;
    const seconds = Math.floor(nowSeconds - thenSeconds);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + ' años';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' meses';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' dias';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' horas';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutos';
    }
    return Math.floor(seconds) + ' segundos';
  }

  markNotNullControls(form: FormGroup): void {
    for (const key in form.controls) {
      if (Object.prototype.hasOwnProperty.call(form.controls, key)) {
        const control = form.controls[key];
        if (control.value !== null) {
          control.markAsTouched();
        }
      }
    }
  }

  fileToBase64(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(null);
      };
    });
  }

  async popInfo(info: string, event: any): Promise<void> {
    const pop = await this.popC.create({
      component: PopInfoComponent,
      event,
      componentProps: { info },
      mode: 'ios',
      size: 'auto',
      cssClass: 'pop-info',
    });
    await pop.present();
  }

 async popContact(event: any): Promise<void> {
  const pop = await this.popC.create({
    component: ContactFormComponent,   // ✅ tu formulario de contacto
    event,
    mode: 'ios',
    size: 'auto',
    cssClass: 'pop-contact',           // clase CSS distinta para estilos
  });
  await pop.present();
}
  async tokenHeader(): Promise<HttpHeaders> {
    const user = await this.auth.currentUser;
    const token = await (user as firebase.User).getIdToken(true);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return headers;
  }

  processPagination<T extends { uid?: string }>(
    pagination: Pagination<T>,
    snaps: QuerySnapshot<T>,
    direction: 'next' | 'prev',
    limit: number
  ): void {
    if (!snaps.empty) {
      if (!pagination.first) {
        pagination.first = { ...snaps.docs[0].data(), uid: snaps.docs[0].id };
      }
      if (snaps.docs.length !== limit) {
        pagination.onLast = true;
      } else {
        pagination.onLast = false;
      }
      if (direction === 'next') {
        pagination.last = snaps.docs[snaps.docs.length - 1];
        pagination.start = snaps.docs[0];
        pagination.page = pagination.page + 1;
        if (pagination.first.uid === snaps.docs[0].id) {
          pagination.onStart = true;
        } else {
          pagination.onStart = false;
        }
      } else if (direction === 'prev') {
        pagination.start = snaps.docs[snaps.docs.length - 1];
        pagination.last = snaps.docs[0];
        pagination.page = pagination.page - 1;
        if (pagination.first.uid === snaps.docs[snaps.docs.length - 1].id) {
          pagination.onStart = true;
        } else {
          pagination.onStart = false;
        }
      }
    } else {
      if (!pagination.page) {
        pagination.page = 1;
      }
      pagination.onLast = true;
    }
  }

  checkFields<T>(
    body: T,
    keys: (keyof T)[],
  ): boolean {
    for (const key of keys) {
      if (body?.[key] === undefined) {
        return false;
      }
    }
    return true;
  };

  daysBetwen(start: Date, end: Date): number {
    const miliDay = 1000 * 60 * 60 * 24;
    const dif = end.getTime() - start.getTime();
    return Math.round(dif / miliDay);
  }

  stateByCpMexico(cp: string): string | null {
    const postalCode = String(cp).padStart(5, '0').substring(0, 2);
    const states = MexicoStatesByCP;
    const state = states[`${postalCode}`];
    return state || null;
  }

  mexicoTimestamp(date?: string | Date): Timestamp {
    // Crea el objeto DateTime con zona México desde el input o la hora actual
    const mexicoDateTime = date
      ? DateTime.fromJSDate(new Date(date)).setZone('America/Mexico_City', { keepLocalTime: false })
      : DateTime.now().setZone('America/Mexico_City');

    // Convierte a objeto Date con la hora ajustada a México
    const nativeDate = mexicoDateTime.toJSDate();

    // Devuelve el Timestamp de Firestore con fecha y hora correctas
    return Timestamp.fromDate(nativeDate);
  }

  rangeDateValidator(min: string, max: string) {
    return (c: AbstractControl) => {
      const val = c?.value;
      if (!val) return null;
      const dateVal = new Date(val);
      const minDate = new Date(min as string);
      const maxDate = new Date(max as string);
      if (isNaN(dateVal.getTime())) {
        return { rangeDate: { invalidDate: true } };
      }
      if (dateVal < minDate || dateVal > maxDate) {
        return { rangeDate: { min: min, max: max } };
      }
      return null;
    };
  }

  quitArrayDuplicity<T>(array: T[], key?: keyof T): T[] {
    const seen = new Set<any>();
    return array.filter((item) => {
      const value = key ? item[key] : item;
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
}
