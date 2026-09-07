import { Component, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

declare var grecaptcha: any;

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
  styleUrls: ['./home-contact.component.scss'],
  standalone: false,
})
export class HomeContactComponent {
  siteKey: string = '6Lfo464tAAAAACSjw7oA2wEMkonwoVAbXYgyLwpn';
  isSending: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private injector: EnvironmentInjector // 1. Inyectamos el EnvironmentInjector
  ) {}

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    let captchaResponse = '';

    if (typeof grecaptcha !== 'undefined') {
      captchaResponse = grecaptcha.getResponse();
    }

    if (!captchaResponse) {
      const responseInput = document.getElementById('g-recaptcha-response') as HTMLTextAreaElement;
      if (responseInput) {
        captchaResponse = responseInput.value;
      }
    }

    if (!captchaResponse) {
      alert('Por favor, confirma que no eres un robot completando el Captcha.');
      return;
    }

    this.isSending = true;

    try {
      await runInInjectionContext(this.injector, () => {
        return this.firestore.collection('contactos').add({
          nombre: form.value.user_name || '',
          email: form.value.user_email || '',
          telefono: form.value.user_phone || '',
          estado: form.value.user_state || '',
          tipoPersona: form.value.person_type || '',
          servicio: form.value.service || '',
          createdAt: new Date(),
        });
      });

      alert('¡Mensaje enviado con éxito!');
      form.resetForm();

      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      alert('Ocurrió un error al enviar tu información.');
    } finally {
      this.isSending = false;
    }
  }
}
