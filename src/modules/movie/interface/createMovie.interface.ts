export interface CreateMovieRequest {
    title: string;
    description: string;
    releaseYear: number;
    image?: Express.Multer.File;
    video?: Express.Multer.File;
}
