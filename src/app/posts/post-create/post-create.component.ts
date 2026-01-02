import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostServiceService } from '../post-service/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Post } from '../post-service/post.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-post-create',
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  postContent = '';
  postTitle = '';
  selectedImage: File | null = null;
  
  private postService = inject(PostServiceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  postId = '';
  mode: Mode = 'create';
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.mode = 'edit';
        this.postId = params['id'];
        this.postService.getPost(this.postId).subscribe((post: Post) => {
          this.postTitle = post.title;
          this.postContent = post.description;
        });
      }
      this.isLoading.set(false);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoading.set(true);
    
    if (this.mode === 'create') {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      console.log('Image selected:', file.name);
    }
  }

  private async updatePost(): Promise<void> {
    console.log('Updating post...');
    
    const updatedPost = await this.postService.updatePost({
      id: this.postId,
      title: this.postTitle,
      description: this.postContent,
    });
    
    console.log('Post updated:', updatedPost);
    this.router.navigate(['/posts']);
  }

  private createPost(): void {
    console.log('Creating post...');
    
    this.postService.addPost({
      id: crypto.randomUUID(),
      title: this.postTitle,
      description: this.postContent,
    });
    
    this.router.navigate(['/posts']);
  }
}
