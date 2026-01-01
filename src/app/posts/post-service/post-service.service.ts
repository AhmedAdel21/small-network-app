import { Injectable, signal } from '@angular/core';
import { Post, PostResponse } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PostServiceService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}

  notifyPostsListners() {
    this.postsUpdated.next([...this.posts]);
  }
  getPostsListner() {
    return this.postsUpdated.asObservable();
  }
  addPost(post: Post) {
    this.http
      .post<PostResponse>('http://localhost:3000/api/posts', post)
      .subscribe((response: any) => {
        console.log(response);
        this.posts.push(post);
        this.getPosts();
      });
  }
  getPosts() {
    console.log('getPosts service');
    this.http
      .get<PostResponse>('http://localhost:3000/api/posts')
      .subscribe((response: PostResponse) => {
        console.log(response);
        this.posts = response.posts;
        this.notifyPostsListners();
      });
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
