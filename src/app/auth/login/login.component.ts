import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatProgressSpinner,
    MatCard,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLoading = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit(): void {
    const subscription = this.authService
      .getAuthListner()
      .subscribe((isLoggedIn: boolean) => {
        this.isLoading.set(false);

        if (isLoggedIn) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/login']);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onLogin(loginForm: NgForm): void {
    console.log('login form', loginForm);
    if (loginForm.invalid) {
      console.log('invalid form');
      return;
    }
    this.isLoading.set(true);
    this.authService.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });
  }
}
