import { Component, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
export class LoginComponent {
  isLoading = signal<boolean>(false);

  onLogin(loginForm: NgForm): void {
    this.isLoading.set(true);
    console.log(loginForm);
    this.isLoading.set(false);
  }
}
