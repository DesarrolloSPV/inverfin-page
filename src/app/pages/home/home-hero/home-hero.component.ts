import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
  standalone: false,
})
export class HomeHeroComponent implements AfterViewInit {
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
