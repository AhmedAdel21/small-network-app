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
  expiresIn?: number;
}

export interface AuthData {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
