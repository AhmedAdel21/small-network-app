export interface PostsResponse {
  message: string;
  posts: Post[];
  totalPosts: number;
}
export interface PostResponse {
  message: string;
  post: any;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image?: File | string;
}
export interface PostsData {
  posts: Post[];
  totalPosts: number;
}
