import { Component, inject, OnInit } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/service/auth.service';
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'small-network-app';
  private authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.autoAuth();
  }
}
