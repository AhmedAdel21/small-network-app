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
@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = signal<boolean>(false);
  postSerivce = inject(PostServiceService);
  posts: Post[] = [];
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.postSerivce
      .getPostsListner()
      .subscribe((posts) => {
        this.posts = posts;
      });
    this.postSerivce.getPosts();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
