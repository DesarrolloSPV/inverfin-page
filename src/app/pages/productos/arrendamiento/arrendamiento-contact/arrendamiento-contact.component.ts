import { Component } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-arrendamiento-contact',
  templateUrl: './arrendamiento-contact.component.html',
  styleUrls: ['./arrendamiento-contact.component.scss'],
  standalone: false,
})
export class ArrendamientoContactComponent  {

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal();  // ✅ abre el modal centrado
  }
}
