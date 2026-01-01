import { Component } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { HeaderComponent } from './header/header.component';
@Component({
  selector: 'app-root',
  imports: [PostsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'small-network-app';
}
