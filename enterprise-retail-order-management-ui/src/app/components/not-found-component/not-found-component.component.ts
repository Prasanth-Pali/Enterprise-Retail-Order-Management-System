import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found-component',
    imports: [],
    templateUrl: './not-found-component.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './not-found-component.component.css'
})
export class NotFoundComponentComponent {

  constructor(private router: Router) { }

  goToLogin(): void {
    this.router.navigate(['/login'], {
      replaceUrl: true
    });
  }
}
