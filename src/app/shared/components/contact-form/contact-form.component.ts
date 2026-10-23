import { AfterViewInit, Component, ElementRef, EnvironmentInjector, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { Contact } from '../../models/contact.model';
import { Subscription } from 'rxjs';

declare var grecaptcha: any;
declare var gtag: Function;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  standalone: false
})
export class ContactFormComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('recaptchaContainer') recaptchaContainer!: ElementRef;

  // Nueva propiedad para saber si es modal
  @Input() isModal: boolean = false;
  @Input() selectedProduct: string = ''; // Recibe 'Arrendamiento Puro', 'Factoraje', etc.

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
    private modalCtrl: ModalController
  ) {
    this.formContact = this.createForm();
    this.contactosCollection = this.firestore.collection<Contact>('contactos');
  }

  ngOnInit() {
    this.setProductValue();
  }

  // Detecta si la propiedad 'selectedProduct' cambia al abrir el modal
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProduct'] && changes['selectedProduct'].currentValue) {
      this.setProductValue();
    }
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

  // Setea el valor de selectedProduct en el control 'servicio'
  private setProductValue() {
    if (this.selectedProduct && this.formContact) {
      this.formContact.patchValue({
        servicio: this.selectedProduct
      });
    }
  }

  // Método para cerrar el modal manualmente
  async dismissModal() {
    try {
      const topModal = await this.modalCtrl.getTop();
      if (topModal) {
        await this.modalCtrl.dismiss();
      }
    } catch (e) {
      console.warn('El modal ya estaba cerrado o no existe un overlay activo:', e);
    }
  }

  // Método auxiliar para obtener el gclid de la URL o almacenamiento local
  private getClickId(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    let gclid = urlParams.get('gclid');
    if (!gclid) {
      gclid = localStorage.getItem('gclid');
    }
    return gclid;
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
      const gclidValue = this.getClickId();
      const contactData: any = { // Usamos any para evitar conflicto con el modelo si aún no tiene gclid definido
        ...formData,
        gclid: gclidValue || '', //  Se guarda el gclid para atribuir la conversión en Google Ads
        createdAt: new Date() as any,
      };

      // 1. Guardar en Firebase Firestore
      await this.contactosCollection.add(contactData);

      // 2. Disparar evento de conversión hacia Google Ads / GA4
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          producto: formData.servicio || 'General',
          canal: 'formulario'
        });
        console.log('✅ Evento generate_lead enviado a Google Tag');
      } else if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'generate_lead',
          producto: formData.servicio || 'General',
          canal: 'formulario'
        });
        console.log('✅ Evento enviado a dataLayer');
      }

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

      // Cierra el modal tras completar la operación de forma segura
      await this.dismissModal();

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

      this.showRFC = isChecked;

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
