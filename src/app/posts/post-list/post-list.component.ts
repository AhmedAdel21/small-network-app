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
import { Post, PostsData } from '../post-service/post.model';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  imports: [
    MatExpansionModule,
    RouterLink,
    MatProgressSpinner,
    MatPaginatorModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = signal<boolean>(false);
  postSerivce = inject(PostServiceService);
  posts: Post[] = [];
  private subscription: Subscription = new Subscription();
  isLoading = signal<boolean>(true);
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];

  ngOnInit(): void {
    this.subscription = this.postSerivce
      .getPostsListner()
      .subscribe((posts: PostsData) => {
        this.posts = posts.posts;
        this.totalPosts = posts.totalPosts;
        this.isLoading.set(false);
      });
    this.postSerivce.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(id: string) {
    this.isLoading.set(true);
    console.log('deleting post', id);
    this.postSerivce.deletePost(id);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  handlePageEvent(event: PageEvent) {
    this.isLoading.set(true);
    console.log(event);
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.postSerivce.getPosts(this.postsPerPage, this.currentPage);
  }
}
