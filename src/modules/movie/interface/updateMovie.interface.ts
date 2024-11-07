export declare interface UpdateMovieRequest {
  title?: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  image?: Express.Multer.File;
  video?: Express.Multer.File;
}
