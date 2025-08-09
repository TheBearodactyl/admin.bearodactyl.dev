export interface Book {
  id: string | number;
  title: string;
  author: string;
  genres: string[];
  tags: string[];
  rating: number;
  status: string;
  description: string;
  myThoughts: string;
  links?: { title: string; url: string }[];
  coverImage: string;
  explicit: boolean;
  color?: string;
}

export interface Review {
  chapter: number;
  description: string;
  rating: number;
  thoughts?: string;
}

export interface Project {
  name: string;
  description: string;
  tags?: string[];
  source: string;
  coverImage?: string;
  installCommand?: string;
}

export interface Game {
  id: string | number;
  title: string;
  developer: string;
  genres: string[];
  tags: string[];
  rating: number;
  status: string;
  description: string;
  myThoughts: string;
  links?: { title: string; url: string }[];
  coverImage?: string;
  explicit: boolean;
  percent: number;
}

export type DataType = "books" | "games" | "reviews" | "projects";
export type DataItem = Book | Game | Review | Project;

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

export interface AppError {
  message: string;
  type: "error" | "warning" | "info";
  timestamp: number;
}
