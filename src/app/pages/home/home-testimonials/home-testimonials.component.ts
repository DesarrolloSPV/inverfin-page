import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface TestimonialHeader {
  subtitle: string;
  title: string;
  description: string;
}

export interface LocalizedText {
  [key: string]: string; 
  es: string;
  en: string;
}

export interface Testimonial {
  id: number;
  logo: string;
  name: string;
  role: LocalizedText;
  comment: LocalizedText;
}

@Component({
  selector: 'app-home-testimonials',
  templateUrl: './home-testimonials.component.html',
  styleUrls: ['./home-testimonials.component.scss'],
  standalone: false,
})
export class HomeTestimonialsComponent implements AfterViewInit {
  @ViewChild('swiperTestimonials') swiperEl!: ElementRef;

  // Arreglo de testimonios
  testimonialsList: Testimonial[] = [
    {
      id: 1,
      logo: '/assets/img/Logo.svg',
      name: 'Natalia Paredes',
      role: {
        es: 'Consultora Financiera',
        en: 'Financial Consultant',
      },
      comment: {
        es: '“Inverfin transformó mi forma de ver las finanzas personales.”',
        en: '“Inverfin transformed the way I look at personal finances.”',
      },
    },
    {
      id: 2,
      logo: '/assets/img/Logo.svg',
      name: 'Luisa Mendoza',
      role: {
        es: 'Empresaria',
        en: 'Entrepreneur',
      },
      comment: {
        es: '“Sentí un acompañamiento real en todo el proceso de inversión.”',
        en: '“I felt genuine guidance throughout the entire investment process.”',
      },
    },
    {
      id: 3,
      logo: '/assets/img/Logo.svg',
      name: 'Carlos Núñez',
      role: {
        es: 'Contador',
        en: 'Accountant',
      },
      comment: {
        es: '“Su enfoque claro y confiable me dio la seguridad que necesitaba.”',
        en: '“Their clear and reliable approach gave me the confidence I needed.”',
      },
    },
    {
      id: 4,
      logo: '/assets/img/Logo.svg',
      name: 'María Torres',
      role: {
        es: 'Inversionista',
        en: 'Investor',
      },
      comment: {
        es: '“Inverfin me ayudó a invertir con confianza y respaldo profesional.”',
        en: '“Inverfin helped me invest with confidence and professional support.”',
      },
    },
  ];

  constructor(public translate: TranslateService) {}

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