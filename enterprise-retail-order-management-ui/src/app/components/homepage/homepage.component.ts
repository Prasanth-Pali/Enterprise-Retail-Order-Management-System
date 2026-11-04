import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-homepage',
    imports: [],
    templateUrl: './homepage.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  constructor(private router: Router) { }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
