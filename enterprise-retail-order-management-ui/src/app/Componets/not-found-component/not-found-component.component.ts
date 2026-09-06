import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-component',
  standalone: true,
  imports: [],
  templateUrl: './not-found-component.component.html',
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
