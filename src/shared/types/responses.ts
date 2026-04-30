export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
