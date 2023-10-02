export interface Photo {
  src: string;
  comments: Comment[];
  timestamp: string;
}

export interface Comment {
  text: string;
  timestamp: string;
}
