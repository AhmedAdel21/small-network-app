import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { PostServiceService } from '../post-service/post-service.service';
import { Post } from '../post-service/post.model';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, RouterLink, MatProgressSpinner],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = signal<boolean>(false);
  postSerivce = inject(PostServiceService);
  posts: Post[] = [];
  private subscription: Subscription = new Subscription();
  isLoading = signal<boolean>(true);
  ngOnInit(): void {
    this.subscription = this.postSerivce
      .getPostsListner()
      .subscribe((posts) => {
        this.posts = posts;
        this.isLoading.set(false);
      });
    this.postSerivce.getPosts();
  }
  onDelete(id: string) {
    this.isLoading.set(true);
    console.log('deleting post', id);
    this.postSerivce.deletePost(id);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
