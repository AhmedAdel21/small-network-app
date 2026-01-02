export interface PostsResponse {
  message: string;
  posts: Post[];
}
export interface PostResponse {
  message: string;
  post: any;
}

export interface Post {
  id: string;
  title: string;
  description: string;
}
