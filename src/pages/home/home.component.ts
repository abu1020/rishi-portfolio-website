
import { Component, ChangeDetectionStrategy, signal, afterNextRender, ViewChild, ElementRef, inject, DestroyRef } from '@angular/core';

declare var lucide: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class HomeComponent {
  isModalVisible = signal(false);
  passwordInput = signal('');
  errorMessage = signal('');
  private destroyRef = inject(DestroyRef);

  @ViewChild('passInput') passInput!: ElementRef<HTMLInputElement>;

  private readonly PASS = "Agr*1234@";
  private readonly SECURE_URL = "https://script.google.com/macros/s/AKfycbwzLHYiS-SZLjyNBGPIqaTvmpXYnYwioqq2d5uDf_5KWDmUfPB79jmmuGjTZf37_ELpkA/exec";

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });

    // Ensure body scroll is unlocked if component is destroyed while modal is open
    this.destroyRef.onDestroy(() => {
      document.body.classList.remove('overflow-hidden');
    });
  }

  openModal(): void {
    this.passwordInput.set('');
    this.errorMessage.set('');
    this.isModalVisible.set(true);
    document.body.classList.add('overflow-hidden');
    
    // Focus input after transition
    setTimeout(() => {
      if (this.passInput) {
        this.passInput.nativeElement.focus();
      }
    }, 100);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    document.body.classList.remove('overflow-hidden');
    
    setTimeout(() => {
        this.passwordInput.set('');
        this.errorMessage.set('');
    }, 300);
  }

  verifyPassword(): void {
    if (this.passwordInput() === this.PASS) {
      window.open(this.SECURE_URL, '_blank');
      this.closeModal();
    } else {
      this.errorMessage.set('Incorrect access code. Please try again.');
      this.passwordInput.set('');
      this.passInput.nativeElement.focus();
    }
  }

  handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.verifyPassword();
    if (event.key === 'Escape') this.closeModal();
  }
}
