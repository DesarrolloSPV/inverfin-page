import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-history-contact',
  templateUrl: './history-contact.component.html',
  styleUrls: ['./history-contact.component.scss'],
  standalone: false,
})
export class HistoryContactComponent  {
  constructor(private utilities: UtilitiesService) {}

  async openContactModal() {
    await this.utilities.popContactModal();  // ✅ abre el modal centrado
  }
}
