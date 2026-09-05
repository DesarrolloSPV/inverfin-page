import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
  styleUrls: ['./home-contact.component.scss'],
  standalone: false,
})
export class HomeContactComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onSubmit() {
    // Lógica para enviar el formulario
    console.log('Formulario enviado');
  }
}
