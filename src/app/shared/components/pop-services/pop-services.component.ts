import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-services',
  templateUrl: './pop-services.component.html',
  styleUrls: ['./pop-services.component.scss'],
  standalone: false,
})
export class PopServicesComponent  implements OnInit {

  constructor(public popC: PopoverController) {}

  ngOnInit() {}

}
