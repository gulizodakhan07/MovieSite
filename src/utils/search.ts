import { Op } from 'sequelize';
import { Movie } from '../modules/movie/model';
export const searchMovies = async (query: string): Promise<Movie[]> => {

    return await Movie.findAll(
        {
            where:
            {
                title: { [Op.like]: `%${query}%` },
                description: { [Op.like]: `%${query}%` },
            }
        });
};