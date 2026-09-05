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
    // Garantiza que Swiper se inicialice e inicie el autoplay inmediatamente
    setTimeout(() => {
      const swiper = this.swiperEl?.nativeElement?.swiper;
      if (swiper) {
        swiper.autoplay?.start();
      }
    }, 100);
  }
}
