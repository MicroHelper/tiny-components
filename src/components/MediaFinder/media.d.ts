interface Accepts {
  image?: string | false;
  video?: string | false;
  audio?: string | false;
}

type MediaType = "image" | "video" | "audio";

interface MongoDoc {
  _id: string;
}

interface Media extends MongoDoc {
  type: string;
  dir: string;
  fileName: string;
}
