import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostServiceService } from '../post-service/post-service.service';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  postContent = signal<string>('');
  postTitle = signal<string>('');
  postSerivce = inject(PostServiceService);

  createPost() {
    console.log('Creating post...');

    this.postSerivce.addPost({
      id: crypto.randomUUID(),
      title: this.postTitle(),
      description: this.postContent(),
    });
    // this.postContent.set('');
    // this.postTitle.set('');
  }
}
