export declare interface UpdateMovieRequest{
    title?: string
    description?: string
    relaseYear?: number
    image?: Express.Multer.File
    video?: Express.Multer.File
}