import { inject, Injectable } from '@angular/core';
import { Post, PostResponse, PostsData, PostsResponse } from './post.model';
import { map, pipe, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../constants/network.constants';
import { AuthService } from '../../auth/service/auth.service';
@Injectable({
  providedIn: 'root',
})
export class PostServiceService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<PostsData>();
  totalPosts = 0;
  private apiUrl = `${API_URL}/posts`;
  private authService = inject(AuthService);
  constructor(private http: HttpClient) {}

  notifyPostsListners() {
    this.postsUpdated.next({
      posts: [...this.posts],
      totalPosts: this.totalPosts,
    });
  }
  getPostsListner() {
    return this.postsUpdated.asObservable();
  }
  async addPost(post: Post) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('image', post.image as File, post.title);
    const token = this.authService.getToken();
    console.log('token in addPost service', token);
    this.http
      .post<PostResponse>(this.apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((response: PostResponse) => {
          const post = response.post;
          return {
            id: post._id,
            title: post.title,
            description: post.description,
            image: post.imagePath,
          };
        })
      )
      .subscribe((response: Post) => {
        console.log('addPost response', response);
        console.log(response);
        this.posts.push(response);
        this.totalPosts++;
        this.notifyPostsListners();
      });
  }
  getPosts(pageSize: number, currentPage: number) {
    console.log('getPosts service');
    this.http
      .get<PostsResponse>(this.apiUrl, {
        params: { pageSize: pageSize, page: currentPage },
      })
      .pipe(
        map((response: PostsResponse) => {
          return {
            totalPosts: response.totalPosts,
            posts: response.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                description: post.description,
                image: post.imagePath,
              };
            }),
          };
        })
      )
      .subscribe((response: PostsData) => {
        console.log(response);
        this.posts = response.posts;
        this.totalPosts = response.totalPosts;

        this.notifyPostsListners();
      });
  }
  deletePost(id: string) {
    console.log('deletePost service', id);
    const token = this.authService.getToken();
    console.log('token in deletePost service', token);
    this.http
      .delete(`${this.apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe((response: any) => {
        console.log(response);
        this.posts = [...this.posts.filter((post) => post.id !== id)];
        this.totalPosts--;
        this.notifyPostsListners();
      });
  }
  updatePost(post: Post) {
    console.log('updatePost service', post);
    let postData: FormData | Post = post;
    if (typeof post.image === 'string') {
    } else {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('description', post.description);
      postData.append('image', post.image as File, post.title);
    }

    const token = this.authService.getToken();
    console.log('token in updatePost service', token);
    return this.http
      .put<PostResponse>(`${this.apiUrl}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((response: PostResponse) => {
          const post = response.post;
          return {
            id: post._id,
            title: post.title,
            description: post.description,
            image: post.imagePath,
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
          image: post.imagePath,
        };
      })
    );
  }
}
