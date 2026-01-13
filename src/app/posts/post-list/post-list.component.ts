import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { PostServiceService } from '../post-service/post-service.service';
import { Post, PostsData } from '../post-service/post.model';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/service/auth.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-post-list',
  imports: [
    MatExpansionModule,
    RouterLink,
    MatProgressSpinner,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  panelOpenState = signal<boolean>(false);
  postSerivce = inject(PostServiceService);
  posts: Post[] = [];
  isLoading = signal<boolean>(true);
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  isLoggedIn = signal<boolean>(false);
  userId = this.authService.getId();
  ngOnInit(): void {
    const postSubscription = this.postSerivce
      .getPostsListner()
      .subscribe((posts: PostsData) => {
        this.posts = posts.posts;
        this.totalPosts = posts.totalPosts;
        this.isLoading.set(false);
      });
    this.postSerivce.getPosts(this.postsPerPage, this.currentPage);

    const authSubscription = this.authService
      .getAuthListner()
      .subscribe((isLoggedIn: boolean) => {
        console.log('isLoggedIn in post list component', isLoggedIn);
        this.isLoggedIn.set(isLoggedIn);
      });

    this.destroyRef.onDestroy(() => {
      postSubscription.unsubscribe();
      authSubscription.unsubscribe();
    });
  }
  onDelete(id: string) {
    this.isLoading.set(true);
    console.log('deleting post', id);
    this.postSerivce.deletePost(id);
  }

  handlePageEvent(event: PageEvent) {
    this.isLoading.set(true);
    console.log(event);
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.postSerivce.getPosts(this.postsPerPage, this.currentPage);
  }
}
