import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-values',
  templateUrl: './home-values.component.html',
  styleUrls: ['./home-values.component.scss'],
  standalone: false,
})
export class HomeValuesComponent implements AfterViewInit {
  @ViewChild('swiperHero') swiperEl!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      const swiper = this.swiperEl?.nativeElement?.swiper;
      if (swiper) {
        swiper.update(); // Actualiza Swiper y sus clones
        swiper.autoplay?.start(); // Fuerza inicio de autoplay
      }
    }, 200);
  }
}
