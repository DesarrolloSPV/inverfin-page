import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
  standalone: false,
})
export class HomeHeroComponent implements AfterViewInit {

  ngAfterViewInit() {
    const swiperEl = document.querySelector('swiper-container') as any;

    if (swiperEl) {
      // Esperar a que Swiper se inicialice
      swiperEl.initialize();

      // Acceder a la instancia real
      const swiper = swiperEl.swiper;

      // Animar el primer slide
      const firstSlide = swiperEl.querySelector('.swiper-slide');
      if (firstSlide) {
        const animatedEls = firstSlide.querySelectorAll('.hero-text, .hero-image');
        animatedEls.forEach((el: HTMLElement) => el.classList.add('animate'));
      }

      // Callback de cambio de slide
      swiper.on('slideChange', () => {
        console.log('Slide activo:', swiper.activeIndex); // 👈 verifica en consola

        const currentSlide = swiperEl.querySelectorAll('.swiper-slide')[swiper.activeIndex];
        if (currentSlide) {
          const animatedEls = currentSlide.querySelectorAll('.hero-text, .hero-image');
          animatedEls.forEach((el: HTMLElement) => {
            el.classList.remove('animate');
            void el.offsetWidth;
            el.classList.add('animate');
          });
        }
      });
    }
  }
}
