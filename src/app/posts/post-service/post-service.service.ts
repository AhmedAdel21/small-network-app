import { Injectable, signal } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PostServiceService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor() {}

  notifyPostsListners() {
    this.postsUpdated.next([...this.posts]);
  }
  getPostsListner() {
    return this.postsUpdated.asObservable();
  }
  addPost(post: Post) {
    this.posts.push(post);
    this.notifyPostsListners();
  }
  getPosts() {
    return [...this.posts];
  }
  deletePost(index: number) {
    this.posts = [...this.posts.filter((_, i) => i !== index)];
    this.notifyPostsListners();
  }
  updatePost(index: number, post: Post) {
    this.posts[index] = post;
    this.notifyPostsListners();
  }
}
