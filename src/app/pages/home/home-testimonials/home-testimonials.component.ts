import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LocalizedText {
  [key: string]: string;
  es: string;
  en: string;
}

export interface Testimonial {
  id: number;
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

  testimonialsList: Testimonial[] = [
    {
      id: 1,
      comment: {
        es: '“Destacamos la atención personalizada, el seguimiento oportuno y la claridad durante todo el proceso. \n El equipo siempre ha mostrado disposición para resolver nuestras dudas y buscar alternativas financieras acordes con las necesidades de nuestra empresa. \n Valoramos mucho la comunicación, la agilidad y el acompañamiento que nos han brindado. \n Sin duda, ha sido una experiencia positiva y los consideramos un proveedor confiable y profesional.”',
        en: '“We highlight the personalized attention, timely follow-up, and clarity throughout the entire process. \n The team has always shown a willingness to address our questions and seek financial alternatives tailored to our company\'s needs. \n We greatly value the communication, agility, and support they have provided us. Without a doubt, it has been a positive experience, and we consider them a reliable and professional partner.”',
      },
    },
    {
      id: 2,
      comment: {
        es: '“Sentí un acompañamiento real y cercano en todo el proceso de estructuración de la inversión.”',
        en: '“I felt genuine and close guidance throughout the entire investment structuring process.”',
      },
    },
    {
      id: 3,
      comment: {
        es: '“Hemos tenido una excelente experiencia colaborando juntos. \n \n Su enfoque claro, oportuno y confiable nos dio la seguridad operativa que necesitábamos.”',
        en: '“We have had an excellent experience collaborating together. \n \n Their clear, timely, and reliable approach gave us the operational confidence we needed.”',
      },
    },
    {
      id: 4,
      comment: {
        es: '“Inverfin nos ayudó a acceder a liquidez y herramientas financieras con total confianza y respaldo profesional.”',
        en: '“Inverfin helped us access liquidity and financial tools with complete confidence and professional support.”',
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
