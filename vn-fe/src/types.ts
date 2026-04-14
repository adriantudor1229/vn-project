export interface VnTitle {
  lang: string;
  official: boolean;
  title: string;
  latin: string | null;
}

export interface Vn {
  titles: VnTitle[];
  image: string | null;
  cImage: string | null;
  olang: string;
  cVotecount: number;
  cRating: number | null;
  cAverage: number | null;
  cLength: number | null;
  cLengthnum: number | null;
  length: number | null;
  devstatus: number | null;
  alias: string | null;
  description: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
