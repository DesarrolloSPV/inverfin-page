import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seguros-benefits',
  templateUrl: './seguros-benefits.component.html',
  styleUrls: ['./seguros-benefits.component.scss'],
  standalone: false,
})
export class SegurosBenefitsComponent  {
    active = 1;

  setActive(index: number) {
    this.active = index;
    console.log('Activo:', this.active);
  }
}
