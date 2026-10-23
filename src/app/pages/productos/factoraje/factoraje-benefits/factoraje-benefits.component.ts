import { Component } from '@angular/core';

@Component({
  selector: 'app-factoraje-benefits',
  templateUrl: './factoraje-benefits.component.html',
  styleUrls: ['./factoraje-benefits.component.scss'],
  standalone: false,
})
export class FactorajeBenefitsComponent  {
  active = 1;

  setActive(index: number) {
    this.active = index;
    console.log('Activo:', this.active);
  }
}
