export interface PostResponse {
  message: string;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
}
