import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pop-info',
  templateUrl: './pop-info.component.html',
  styleUrls: ['./pop-info.component.scss'],
  standalone: false,
})
export class PopInfoComponent {
  @Input() info: string | undefined;
}
