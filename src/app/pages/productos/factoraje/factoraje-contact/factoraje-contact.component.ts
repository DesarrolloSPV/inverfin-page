import { Component } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-factoraje-contact',
  templateUrl: './factoraje-contact.component.html',
  styleUrls: ['./factoraje-contact.component.scss'],
  standalone: false,
})
export class FactorajeContactComponent {

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal('Factoraje');  // ✅ abre el modal centrado
  }
}
