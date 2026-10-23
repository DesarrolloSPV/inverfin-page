import { Component } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopServicesComponent } from '../pop-services/pop-services.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  constructor(private utilities: UtilitiesService, private popC: PopoverController, private translate: TranslateService, private alertC: AlertController) {}

  async openContact(event: any) {
    await this.utilities.popContact(event);  // ✅ usa el nuevo método
  }

  async openServices(event: Event): Promise<void> {
    const pop = await this.popC.create({
      event,
      component: PopServicesComponent,
      mode: 'ios',
    });
    await pop.present();
  }

  async changeLanguage(): Promise<void> {
    const currentLang = this.translate.currentLang;
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
          text: 'ok',
          handler: async (lang: 'es' | 'en') => {
            localStorage.setItem('langage', lang);
            this.translate.use(lang);
          },
        },
      ],
    });
    await alert.present();
  }
}
