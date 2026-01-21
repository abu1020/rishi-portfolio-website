
import { Component, ChangeDetectionStrategy, ElementRef, inject, afterNextRender, DestroyRef } from '@angular/core';

declare var lucide: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ServicesComponent {
  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

  services = [
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
     // We need to re-run this if new elements are added
    setTimeout(() => {
        const newRevealElements = this.elementRef.nativeElement.querySelectorAll('.reveal:not(.is-visible)');
        newRevealElements.forEach((el: Element) => this.observer?.observe(el));
    }, 0);
  }
}
