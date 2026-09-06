import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private router: Router) { }

  @HostListener('window:popstate')
  onBrowserBack(): void {

    const currentUrl = this.router.url;

    // ONLY dashboard lo Back disable
    if (
      currentUrl === '/admin' ||
      currentUrl === '/customer' ||
      currentUrl === '/404'
    ) {

      history.forward();
    }
  }
}
