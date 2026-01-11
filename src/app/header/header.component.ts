import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  isLoggedIn = signal<boolean>(false);

  ngOnInit(): void {
    const subscription = this.authService
      .getAuthListner()
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn.set(isLoggedIn);
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onLogout() {
    this.authService.logout();
  }
}
