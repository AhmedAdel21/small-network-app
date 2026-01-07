import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostServiceService } from '../post-service/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Post } from '../post-service/post.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { mimeType } from './mime-type.validator';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-post-create',
  imports: [
    ReactiveFormsModule,
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
  form: FormGroup | undefined;

  private postService = inject(PostServiceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  postId = '';
  mode: Mode = 'create';
  isLoading = signal<boolean>(true);
  imagePreview: String = '';
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      content: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      image: new FormControl<File | string | null>(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.mode = 'edit';
        this.postId = params['id'];
        this.postService.getPost(this.postId).subscribe((post: Post) => {
          console.log('post', post);
          this.form?.setValue({
            title: post.title,
            content: post.description,
            image: post.image,
          });
        });
      }
      this.isLoading.set(false);
    });
  }

  onSubmit(): void {
    if (this.form?.invalid) {
      return;
    }

    this.isLoading.set(true);

    if (this.mode === 'create') {
      this.createPost();
    } else {
      this.updatePost();
    }
    this.form?.reset();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // this.form?.get('image')?.setValue(file as File);
      this.form?.patchValue({ image: file });
      this.form?.get('image')?.updateValueAndValidity();
      console.log('Image selected:', file.name);
      console.log('form', this.form?.value.image);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log('imagePreview', this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  private async updatePost(): Promise<void> {
    console.log('Updating post...');

    const updatedPost = await this.postService.updatePost({
      id: this.postId,
      title: this.form?.value.title || '',
      description: this.form?.value.content || '',
      image: this.form?.value.image,
    });

    console.log('Post updated:', updatedPost);
    this.router.navigate(['/posts']);
  }

  private async createPost(): Promise<void> {
    console.log('Creating post...');

    const response = await this.postService.addPost({
      id: crypto.randomUUID(),
      title: this.form?.value.title || '',
      description: this.form?.value.content || '',
      image: this.form?.value.image,
    });

    this.router.navigate(['/posts']);
  }
}
