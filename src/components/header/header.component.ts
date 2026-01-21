
import { Component, ChangeDetectionStrategy, signal, afterNextRender } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare var lucide: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
    // Re-render icons when menu opens/closes
    setTimeout(() => lucide.createIcons(), 0);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
