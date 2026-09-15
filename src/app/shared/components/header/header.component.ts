import { Component } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  constructor(private utilities: UtilitiesService) {}

  async openContact(event: any) {
    await this.utilities.popContact(event);  // ✅ usa el nuevo método
  }
}
