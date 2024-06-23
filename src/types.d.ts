export interface Url {
  realUrl: string;
  shortUrl: string;
  clicks: number
}

export interface addApiResponse extends Url {
  message: string
}

export interface deleteApiResponse {
  message: string;
}
