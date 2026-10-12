import { Component, ChangeDetectionStrategy, signal, afterNextRender, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

declare var lucide: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  firebaseService = inject(FirebaseService);
  
  isMobileMenuOpen = signal(false);
  scrollProgress = signal(0);
  isLoggingIn = signal(false);

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

  async signInWithGoogle() {
    this.isLoggingIn.set(true);
    try {
      await this.firebaseService.loginWithGoogle();
    } finally {
      this.isLoggingIn.set(false);
      setTimeout(() => lucide.createIcons(), 50);
    }
  }

  async signOutUser() {
    await this.firebaseService.logout();
    setTimeout(() => lucide.createIcons(), 50);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    setTimeout(() => lucide.createIcons(), 50);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
