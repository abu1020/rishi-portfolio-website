import { Component, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var lucide: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });
  }
}
