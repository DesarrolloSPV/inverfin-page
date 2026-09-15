import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-testimonials',
  templateUrl: './home-testimonials.component.html',
  styleUrls: ['./home-testimonials.component.scss'],
  standalone: false,
})
export class HomeTestimonialsComponent implements AfterViewInit {
  @ViewChild('swiperTestimonials') swiperEl!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      const swiper = this.swiperEl?.nativeElement?.swiper;
      if (swiper) {
        swiper.update();
        swiper.autoplay?.start();
      }
    }, 300);
  }
}
