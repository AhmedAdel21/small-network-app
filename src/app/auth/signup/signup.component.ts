import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    MatProgressSpinner,
    MatCard,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isLoading = signal<boolean>(false);
  private authService = inject(AuthService);

  onSignup(signupForm: NgForm): void {
    console.log('signup form', signupForm);
    if (signupForm.invalid) {
      console.log('invalid form');
      return;
    }
    this.isLoading.set(true);
    this.authService.register({
      email: signupForm.value.email,
      password: signupForm.value.password,
    });
  }
}
