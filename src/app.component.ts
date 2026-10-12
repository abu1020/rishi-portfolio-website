import { Component, ChangeDetectionStrategy, signal, afterNextRender, inject } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

declare var lucide: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AppComponent {
  firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);

  currentTab = signal<'home' | 'about' | 'services' | 'contact'>('home');
  isModalVisible = signal(false);
  passwordInput = signal('');
  errorMessage = signal('');
  isLoggingIn = signal(false);
  mobileMenuOpen = signal(false);

  // Contact Form
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    serviceType: ['tax-filing', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  formError = signal('');

  expertise = [
    {
      icon: 'book-open',
      title: 'Bookkeeping',
      description: 'Streamlined maintenance of books. We ensure your daily transactions are recorded with 100% accuracy for real-time financial tracking.'
    },
    {
      icon: 'layout-grid',
      title: 'GST Management',
      description: 'End-to-end filing and advisory. Ensuring your business leverages all available input tax credits while maintaining flawless compliance.'
    },
    {
      icon: 'percent',
      title: 'TDS & Statutory',
      description: 'Precise computation and reporting. We handle the complexities of quarterly returns so you can focus on core operations.'
    },
    {
      icon: 'file-check-2',
      title: 'Tax Strategy',
      description: 'Beyond simple ITR filing. We implement legal tax-saving strategies that protect your bottom line and ensure long-term wealth.'
    }
  ];

  servicesList = [
    {
      icon: 'scale',
      title: 'GST Registration/Filing',
      description: 'Navigate the complexities of Goods and Services Tax with our expert guidance, from registration to timely and accurate filing.'
    },
    {
      icon: 'receipt',
      title: 'Income Tax',
      description: 'Optimize your tax position with strategic planning and precise ITR filing for individuals, businesses, and corporations.'
    },
    {
      icon: 'scissors',
      title: 'TDS/TCS Filing',
      description: 'Ensure complete compliance with all Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) regulations and filings.'
    },
    {
      icon: 'notebook-tabs',
      title: 'Bookkeeping',
      description: 'Maintain immaculate financial records. Our systematic bookkeeping services provide a clear, real-time view of your finances.'
    },
    {
      icon: 'bar-chart-big',
      title: 'MIS Reports',
      description: 'Gain actionable insights with custom Management Information System (MIS) reports tailored to your key business metrics.'
    },
    {
      icon: 'store',
      title: 'Ecommerce Business Solutions',
      description: 'From initial setup to ongoing financial management, we provide end-to-end accounting solutions for your online business.'
    }
  ];

  private readonly PASS = "Agr*1234@";
  private readonly SECURE_URL = "https://script.google.com/macros/s/AKfycbwzLHYiS-SZLjyNBGPIqaTvmpXYnYwioqq2d5uDf_5KWDmUfPB79jmmuGjTZf37_ELpkA/exec";

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });
  }

  switchTab(tab: 'home' | 'about' | 'services' | 'contact') {
    this.currentTab.set(tab);
    this.mobileMenuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => lucide.createIcons(), 50);
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

  openModal(): void {
    this.passwordInput.set('');
    this.errorMessage.set('');
    this.isModalVisible.set(true);
    document.body.classList.add('overflow-hidden');
    setTimeout(() => lucide.createIcons(), 50);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  verifyPassword(): void {
    if (this.passwordInput() === this.PASS) {
      window.open(this.SECURE_URL, '_blank');
      this.closeModal();
    } else {
      this.errorMessage.set('Incorrect access code. Please try again.');
      this.passwordInput.set('');
    }
  }

  handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.verifyPassword();
    if (event.key === 'Escape') this.closeModal();
  }

  onContactSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.formError.set('Please fill out all required fields.');
      return;
    }
    this.formError.set('');
    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.contactForm.reset({ serviceType: 'tax-filing' });
      setTimeout(() => lucide.createIcons(), 50);
    }, 1000);
  }

  resetContact() {
    this.isSubmitted.set(false);
    setTimeout(() => lucide.createIcons(), 50);
  }
}
