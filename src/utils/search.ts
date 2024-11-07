import { Op } from 'sequelize';
import { Movie } from 'src/modules/movie/model/movie.model';

export const searchMovies = async (query: string): Promise<any> => {
  if (!query || query.trim() === '') {
    throw new Error('Query parametri kiritilishi kerak!');
  }

  return Movie.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
  });
};
