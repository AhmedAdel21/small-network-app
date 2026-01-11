export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthDataResponse {
  message: string;
  id: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthData {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}
