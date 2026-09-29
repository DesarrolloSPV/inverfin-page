import { Component } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-factoraje-home',
  templateUrl: './factoraje-home.component.html',
  styleUrls: ['./factoraje-home.component.scss'],
  standalone: false,
})
export class FactorajeHomeComponent {

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal();  // ✅ abre el modal centrado
  }
}
