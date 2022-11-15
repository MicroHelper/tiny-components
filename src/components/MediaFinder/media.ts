export interface Accepts {
  image?: string | false;
  video?: string | false;
  audio?: string | false;
}

export type MediaType = "image" | "video" | "audio";

interface MongoDoc {
  _id: string;
}

export interface Media extends MongoDoc {
  type: string;
  dir: string;
  fileName: string;
}
