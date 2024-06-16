export interface Url {
  realUrl: string;
  shortUrl: string;
}

export interface addApiResponse extends Url {
  message: string
}

export interface deleteApiResponse {
  message: string;
}
