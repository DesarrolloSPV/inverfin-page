import { Component, } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-seguros-home',
  templateUrl: './seguros-home.component.html',
  styleUrls: ['./seguros-home.component.scss'],
  standalone: false,
})
export class SegurosHomeComponent {

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal('Seguros');  // ✅ abre el modal centrado
  }
}
