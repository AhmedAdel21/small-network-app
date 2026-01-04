import { Injectable, signal } from '@angular/core';
import { Post, PostResponse, PostsResponse } from './post.model';
import { map, pipe, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PostServiceService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:3000/api/posts';

  notifyPostsListners() {
    this.postsUpdated.next([...this.posts]);
  }
  getPostsListner() {
    return this.postsUpdated.asObservable();
  }
  async addPost(post: Post) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('image', post.image as File);
    this.http
      .post<PostResponse>(this.apiUrl, formData)
      .pipe(
        map((response: PostResponse) => {
          const post = response.post;
          return {
            id: post._id,
            title: post.title,
            description: post.description,
            imagePath: post.imagePath,
          };
        })
      )
      .subscribe((response: Post) => {
        console.log('addPost response', response);
        console.log(response);
        this.posts.push(response);
        this.notifyPostsListners();
      });
  }
  getPosts() {
    console.log('getPosts service');
    this.http
      .get<PostsResponse>(this.apiUrl)
      .pipe(
        map((response: PostsResponse) => {
          return response.posts.map((post: any) => {
            return {
              id: post._id,
              title: post.title,
              description: post.description,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((response: Post[]) => {
        console.log(response);
        this.posts = response;
        this.notifyPostsListners();
      });
  }
  deletePost(id: string) {
    console.log('deletePost service', id);
    this.http.delete(`${this.apiUrl}/${id}`).subscribe((response: any) => {
      console.log(response);
      this.posts = [...this.posts.filter((post) => post.id !== id)];
      this.notifyPostsListners();
    });
  }
  updatePost(post: Post) {
    return this.http
      .put<PostResponse>(`${this.apiUrl}`, post)
      .pipe(
        map((response: PostResponse) => {
          const post = response.post;
          return {
            id: post._id,
            title: post.title,
            description: post.description,
          };
        })
      )
      .subscribe((post: Post) => {
        console.log(post);
        return post;
      });
  }
  getPost(id: string) {
    return this.http.get<PostResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response: PostResponse) => {
        const post = response.post;
        return {
          id: post._id,
          title: post.title,
          description: post.description,
        };
      })
    );
  }
}
