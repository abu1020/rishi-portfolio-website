import { Component, ChangeDetectionStrategy, signal, afterNextRender, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

declare var lucide: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    serviceType: ['tax-filing', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    // Simulate secure backend submission
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.contactForm.reset({ serviceType: 'tax-filing' });
      setTimeout(() => lucide.createIcons(), 50);
    }, 1000);
  }

  resetForm() {
    this.isSubmitted.set(false);
    setTimeout(() => lucide.createIcons(), 50);
  }
}
