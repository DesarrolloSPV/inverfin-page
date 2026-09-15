import { Component,  AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-history-values',
  templateUrl: './history-values.component.html',
  styleUrls: ['./history-values.component.scss'],
  standalone: false,
})
export class HistoryValuesComponent  implements AfterViewInit {
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

