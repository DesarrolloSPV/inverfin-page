import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
  standalone: false,
})
export class HomeHeroComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

ngAfterViewInit() {
  if (this.heroVideo) {
    const video = this.heroVideo.nativeElement;
    document.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(err => console.log('Autoplay bloqueado:', err));
      }
    });
  } else {
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 200);
  }
}
}
