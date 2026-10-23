import { Component } from '@angular/core';
import { PopoverController, AlertController, ModalController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../../services/utilities.service';
import { PopServicesComponent } from '../pop-services/pop-services.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent {
  constructor(
    private utilities: UtilitiesService,
    private popC: PopoverController,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private alertC: AlertController,
    private menuCtrl: MenuController,
  ) {}

/**
   * Abre el formulario de contacto en formato MODAL (centrado).
   */
  async openContact(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    // 1. Cerrar el menú
    await this.menuCtrl.close('menuId');

    // 2. Esperar 200ms para que la animación del menú concluya completamente
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 3. Usar el método que crea un MODAL real y no un Popover
    await this.utilities.popContactModal();
  }

  /**
   * Despliega el menú de servicios en formato popover.
   */
  async openServices(event: Event): Promise<void> {
    const pop = await this.popC.create({
      event,
      component: PopServicesComponent,
      mode: 'ios',
    });
    await pop.present();
  }

  /**
   * Despliega el diálogo de selección de idioma y persiste la preferencia.
   */
  async changeLanguage(): Promise<void> {
    const currentLang = this.translate.currentLang || 'es';

    const alert = await this.alertC.create({
      header: this.translate.instant('common.change-language'),
      inputs: [
        {
          type: 'radio',
          label: 'Español (es)',
          value: 'es',
          checked: currentLang === 'es',
        },
        {
          type: 'radio',
          label: 'English (en)',
          value: 'en',
          checked: currentLang === 'en',
        },
      ],
      buttons: [
        {
          text: this.translate.instant('common.cancel') || 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: async (lang: 'es' | 'en') => {
            if (lang && lang !== currentLang) {
              localStorage.setItem('langage', lang);
              this.translate.use(lang);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
