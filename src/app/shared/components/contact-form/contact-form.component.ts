import { AfterViewInit, Component, ElementRef, EnvironmentInjector, OnInit, runInInjectionContext, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  standalone: false
})
export class ContactFormComponent implements AfterViewInit {
  @ViewChild('recaptchaContainer') recaptchaContainer!: ElementRef;

  showRFC: boolean = false; // Garantiza inicio desactivado

  togglePresolicitud(event: any) {
    this.showRFC = event.detail.checked;
  }

  siteKey: string = '6Lfo464tAAAAACSjw7oA2wEMkonwoVAbXYgyLwpn';
  isSending: boolean = false;
  widgetId: number | null = null;

  constructor(
    private firestore: AngularFirestore,
    private injector: EnvironmentInjector,
    private utilities: UtilitiesService
  ) {}

  // Ciclo de vida
  // ===========================

  ngAfterViewInit() {
    this.initRecaptcha();
  }

  ngOnDestroy() {
    this.widgetId = null;
  }

  // Public functions
  // ===========================

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      void this.utilities.normalToast('Por favor, completa todos los campos obligatorios.');
      return;
    }

    let captchaResponse = '';

    // Obtener respuesta usando el ID exacto del widget renderizado
    if (typeof grecaptcha !== 'undefined' && this.widgetId !== null) {
      captchaResponse = grecaptcha.getResponse(this.widgetId);
    }

    if (!captchaResponse) {
      void this.utilities.normalToast('Por favor, confirma que no eres un robot completando el Captcha.');
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

      void this.utilities.normalAlert('¡Mensaje enviado con éxito!');
      form.resetForm();

      // Resetear el captcha usando su widgetId de manera segura
      if (typeof grecaptcha !== 'undefined' && this.widgetId !== null) {
        try {
          grecaptcha.reset(this.widgetId);
        } catch (e) {
          // Captura posible advertencia de reinicio
        }
      }
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      alert('Ocurrió un error al enviar tu información.');
    } finally {
      this.isSending = false;
    }
  }

  // Private functions
  // ===========================

  // Intenta renderizar el reCAPTCHA asegurando que la librería 'grecaptcha' ya esté en memoria
  private initRecaptcha() {
    const checkGrecaptcha = setInterval(() => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.render && this.recaptchaContainer?.nativeElement) {
        clearInterval(checkGrecaptcha);

        // Limpiamos el contenedor por si había un widget anterior montado
        this.recaptchaContainer.nativeElement.innerHTML = '';

        try {
          this.widgetId = grecaptcha.render(this.recaptchaContainer.nativeElement, {
            sitekey: this.siteKey,
          });
        } catch (e) {
          console.warn('El widget reCAPTCHA ya estaba inicializado o falló al renderizarse:', e);
        }
      }
    }, 100);
  }

}
