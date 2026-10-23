import { Component } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-arrendamiento-home',
  templateUrl: './arrendamiento-home.component.html',
  styleUrls: ['./arrendamiento-home.component.scss'],
  standalone: false,
})
export class ArrendamientoHomeComponent {

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    // Pasamos el producto actual como parámetro
  await this.utilities.popContactModal('Arrendamiento Puro');  }
}
