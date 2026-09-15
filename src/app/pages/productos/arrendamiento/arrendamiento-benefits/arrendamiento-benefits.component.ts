import { Component, } from '@angular/core';

@Component({
  selector: 'app-arrendamiento-benefits',
  templateUrl: './arrendamiento-benefits.component.html',
  styleUrls: ['./arrendamiento-benefits.component.scss'],
  standalone: false,
})
export class ArrendamientoBenefitsComponent {
  active = 1;

  setActive(index: number) {
    this.active = index;
    console.log('Activo:', this.active); // para depurar
  }
}
