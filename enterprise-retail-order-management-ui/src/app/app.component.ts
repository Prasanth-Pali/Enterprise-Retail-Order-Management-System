import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.Eager,
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
      currentUrl === '/404' ||
      currentUrl === '/'
    ) {

      history.forward();
    }
  }
}
