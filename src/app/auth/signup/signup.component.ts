import { Component, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  onSignup(signupForm: NgForm): void {
    this.isLoading.set(true);
    console.log(signupForm);
    this.isLoading.set(false);
  }
}
