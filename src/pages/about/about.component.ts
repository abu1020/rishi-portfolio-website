
import { Component, ChangeDetectionStrategy, ElementRef, inject, afterNextRender, DestroyRef } from '@angular/core';

declare var lucide: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AboutComponent {
  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

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

  constructor() {
    afterNextRender(() => {
      lucide.createIcons();
      this.initIntersectionObserver();
    });

    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
    });
  }

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

    const revealElements = this.elementRef.nativeElement.querySelectorAll('.reveal');
    revealElements.forEach((el: Element) => this.observer?.observe(el));
  }
}
