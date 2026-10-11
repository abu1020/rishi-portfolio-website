import { Component, ChangeDetectionStrategy, signal, afterNextRender, HostListener } from '@angular/core';
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
  scrollProgress = signal(0);

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      this.scrollProgress.set(progress);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
    setTimeout(() => lucide.createIcons(), 0);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
