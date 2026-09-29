import { AfterViewInit, Component, ElementRef, EnvironmentInjector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { Contact } from '../../models/contact.model';
import { Subscription } from 'rxjs';


declare var grecaptcha: any;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  standalone: false
})
export class ContactFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('recaptchaContainer') recaptchaContainer!: ElementRef;

  formContact: FormGroup;
  subs: Subscription[] = [];
  showRFC: boolean = false;

  private contactosCollection: AngularFirestoreCollection<Contact>;

  siteKey: string = '6Lfo464tAAAAACSjw7oA2wEMkonwoVAbXYgyLwpn';
  isSending: boolean = false;
  widgetId: number | null = null;

  constructor(
    private firestore: AngularFirestore,
    private utilities: UtilitiesService,
    private formB: FormBuilder,
    private injector: EnvironmentInjector,
    private modalCtrl: ModalController // 👈 Inyección de ModalController
  ) {
    this.formContact = this.createForm();
    this.contactosCollection = this.firestore.collection<Contact>('contactos');
  }

  ngAfterViewInit() {
    this.initRecaptcha();
  }

  ngOnDestroy() {
    this.widgetId = null;
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

  // Método para cerrar el modal manualmente
  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.formContact.invalid) {
      void this.utilities.normalToast('Por favor, completa todos los campos obligatorios.');
      return;
    }

    let captchaResponse = '';

    if (typeof grecaptcha !== 'undefined' && this.widgetId !== null) {
      captchaResponse = grecaptcha.getResponse(this.widgetId);
    }

    if (!captchaResponse) {
      void this.utilities.normalToast('Por favor, confirma que no eres un robot completando el Captcha.');
      return;
    }

    this.isSending = true;

    try {
      const formData = this.formContact.getRawValue() as Contact;
      const contactData: Contact = {
        ...formData,
        createdAt: new Date() as any,
      };

      await this.contactosCollection.add(contactData);

      const alertMessage = this.showRFC
        ? '¡Mensaje enviado con éxito!\nEn menos de 48 horas te llegará una liga para continuar con tu preautorización de línea de crédito.'
        : '¡Mensaje enviado con éxito!';

      void this.utilities.normalAlert(alertMessage);

      this.formContact.reset();
      this.showRFC = false;

      if (typeof grecaptcha !== 'undefined' && this.widgetId !== null) {
        try {
          grecaptcha.reset(this.widgetId);
        } catch (e) {}
      }

      // Cierra el modal tras completar la operación
      this.dismissModal();

    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      alert('Ocurrió un error al enviar tu información.');
    } finally {
      this.isSending = false;
    }
  }

  private initRecaptcha() {
    const checkGrecaptcha = setInterval(() => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.render && this.recaptchaContainer?.nativeElement) {
        clearInterval(checkGrecaptcha);

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

  private createForm(): FormGroup {
    const form = this.formB.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(this.utilities.regExpPhoneLada)]],
      estado: [null, Validators.required],
      tipoPersona: [null, Validators.required],
      servicio: [null, Validators.required],
      solicitaPreautorizacion: [false],
      rfc: [{ value: null, disabled: true }, Validators.required],
      descripcionFinanciamiento: [null],
      aceptaTerminos: [false, Validators.requiredTrue]
    });

    const sub = form.get('solicitaPreautorizacion')?.valueChanges.subscribe((solicita: boolean | null) => {
      const rfcControl = form.get('rfc');
      const isChecked = !!solicita;

      this.showRFC = isChecked; // Sincroniza el estado dinámico

      if (isChecked) {
        rfcControl?.enable();
      } else {
        rfcControl?.disable();
        rfcControl?.reset();
      }

      form.updateValueAndValidity();
    });

    if (sub) {
      this.subs.push(sub);
    }

    return form;
  }
}
