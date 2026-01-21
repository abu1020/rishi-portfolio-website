
import { Component, ChangeDetectionStrategy, signal, afterNextRender, ElementRef, inject, DestroyRef, ViewChild } from '@angular/core';

declare var lucide: any;

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaComponent {
  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;
  
  // URL for saving contact form data and viewing responses
  private readonly SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzLHYiS-SZLjyNBGPIqaTvmpXYnYwioqq2d5uDf_5KWDmUfPB79jmmuGjTZf37_ELpkA/exec";
  private readonly ADMIN_PASS = "rishi08914";

  // Contact Form Signals
  isContactModalVisible = signal(false);
  contactName = signal('');
  contactEmail = signal('');
  contactSubject = signal('');
  contactMessage = signal('');
  formErrors = signal<{ [key: string]: string }>({});
  isSubmitting = signal(false);
  submissionSuccess = signal(false);

  // Admin Modal Signals
  isAdminModalVisible = signal(false);
  adminPasswordInput = signal('');
  adminErrorMessage = signal('');
  
  @ViewChild('adminPassInput') adminPassInput!: ElementRef<HTMLInputElement>;

  constructor() {
    afterNextRender(() => {
      this.initIntersectionObserver();
    });

    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  // --- Contact Form Methods ---

  openContactModal(): void {
    this.isContactModalVisible.set(true);
  }

  closeContactModal(): void {
    this.isContactModalVisible.set(false);
    setTimeout(() => {
      this.contactName.set('');
      this.contactEmail.set('');
      this.contactSubject.set('');
      this.contactMessage.set('');
      this.formErrors.set({});
      this.isSubmitting.set(false);
      this.submissionSuccess.set(false);
    }, 300);
  }

  private validateForm(): boolean {
    const errors: { [key: string]: string } = {};
    if (!this.contactName().trim()) {
      errors['name'] = 'Name is required.';
    }
    if (!this.contactEmail().trim()) {
      errors['email'] = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail())) {
      errors['email'] = 'Please enter a valid email address.';
    }
    if (!this.contactSubject().trim()) {
      errors['subject'] = 'Subject is required.';
    }
    if (!this.contactMessage().trim()) {
      errors['message'] = 'Message is required.';
    }
    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  handleFormSubmit(): void {
    if (this.validateForm()) {
      this.isSubmitting.set(true);
      this.formErrors.set({});
      
      // Use URLSearchParams for reliable x-www-form-urlencoded transmission to Apps Script
      const params = new URLSearchParams();
      params.append('name', this.contactName());
      params.append('email', this.contactEmail());
      params.append('subject', this.contactSubject());
      params.append('message', this.contactMessage());

      fetch(this.SCRIPT_URL, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: 'no-cors'
      })
      .then(() => {
        this.isSubmitting.set(false);
        this.submissionSuccess.set(true);
        afterNextRender(() => lucide.createIcons());
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        this.isSubmitting.set(false);
        alert('There was an error sending your message. Please try again later.');
      });
    }
  }

  // --- Admin Modal Methods ---

  openAdminModal(): void {
    this.adminPasswordInput.set('');
    this.adminErrorMessage.set('');
    this.isAdminModalVisible.set(true);
    document.body.classList.add('overflow-hidden');
    
    setTimeout(() => {
      if (this.adminPassInput) {
        this.adminPassInput.nativeElement.focus();
      }
    }, 100);
  }

  closeAdminModal(): void {
    this.isAdminModalVisible.set(false);
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
        this.adminPasswordInput.set('');
        this.adminErrorMessage.set('');
    }, 300);
  }

  verifyAdminPassword(): void {
    if (this.adminPasswordInput() === this.ADMIN_PASS) {
      window.open(this.SCRIPT_URL, '_blank');
      this.closeAdminModal();
    } else {
      this.adminErrorMessage.set('Incorrect password.');
      this.adminPasswordInput.set('');
      this.adminPassInput.nativeElement.focus();
    }
  }

  handleAdminKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.verifyAdminPassword();
    if (event.key === 'Escape') this.closeAdminModal();
  }

  // --- Intersection Observer ---

  private initIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const revealElement = this.elementRef.nativeElement.querySelector('.reveal');
    if (revealElement) {
        this.observer.observe(revealElement);
    }
  }
}
