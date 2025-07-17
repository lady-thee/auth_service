export interface ServerHTTPResponse {
  status: number;
  message: string;
  data?: object;
  error?: string | null;
}

// This interface is used to define the structure of the HTTP response on the client side
export interface ClientHTTPResponse {
  status: number;
  message: string;
  data?: object;
  error?: string | null;
}
