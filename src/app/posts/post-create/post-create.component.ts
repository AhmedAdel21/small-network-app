import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostServiceService } from '../post-service/post-service.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Post } from '../post-service/post.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}
@Component({
  selector: 'app-post-create',
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  postContent = signal<string>('');
  postTitle = signal<string>('');
  postSerivce = inject(PostServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  postId: string = '';
  mode: Mode = Mode.CREATE;
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params['id']) {
        this.mode = Mode.EDIT;
        this.postId = params['id'];
        this.postSerivce.getPost(this.postId).subscribe((post: Post) => {
          this.postTitle.set(post.title);
          this.postContent.set(post.description);
        });
      }
      this.isLoading.set(false);
    });
  }
  onClick() {
    switch (this.mode) {
      case Mode.CREATE:
        this.createPost();
        break;
      case Mode.EDIT:
        this.updatePost();
        break;
    }
  }
  async updatePost() {
    console.log('Updating post...');
    this.isLoading.set(true);
    const updatedPost = await this.postSerivce.updatePost({
      id: this.postId,
      title: this.postTitle(),
      description: this.postContent(),
    });
    console.log(updatedPost);
    this.router.navigate(['/posts']);
  }
  createPost() {
    console.log('Creating post...');
    this.isLoading.set(true);
    this.postSerivce.addPost({
      id: crypto.randomUUID(),
      title: this.postTitle(),
      description: this.postContent(),
    });
    this.router.navigate(['/posts']);
    // this.postContent.set('');
    // this.postTitle.set('');
  }
}
