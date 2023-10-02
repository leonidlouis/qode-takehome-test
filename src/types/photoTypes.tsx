import { Timestamp } from "firebase/firestore";

export interface Photo {
  id: string;
  userId: string;
  src: string;
  comments: Comment[];
  timestamp: Timestamp;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: Timestamp;
}
