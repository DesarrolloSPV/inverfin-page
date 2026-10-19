import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-seguros-contact',
  templateUrl: './seguros-contact.component.html',
  styleUrls: ['./seguros-contact.component.scss'],
  standalone: false,
})
export class SegurosContactComponent {

// Reemplaza con el número de teléfono oficial de Inverfin (con clave de país, ej. 52 para México)
  private whatsappNumber: string = '5569622740';

  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal('Seguros'); // ✅ abre el modal centrado
  }

  openWhatsApp() {
    const mensaje = encodeURIComponent('Hola, me interesa solicitar información sobre sus Seguros.');
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
  }
}
