import { MoviesAndShows, StreamingContentMetadataProvider } from './streaming-content-metadata-provider';
import { HTTPError } from './http-error';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_ENDPOINTS = {
  search: (query: string) => `${TMDB_BASE_URL}/search/multi?query=${query}`,
  trending: `${TMDB_BASE_URL}/trending/all/day`,
  popularMovies: `${TMDB_BASE_URL}/movie/popular`,
  popularTvShows: `${TMDB_BASE_URL}/tv/popular`,
  movieGenres: `${TMDB_BASE_URL}/genre/movie/list`,
  tvShowGenres: `${TMDB_BASE_URL}/genre/tv/list`,
  moviesWithGenre: (genreID: number) => `${TMDB_BASE_URL}/discover/movie?with_genres=${genreID}`,
  tvShowsWithGenre: (genreID: number) => `${TMDB_BASE_URL}/discover/tv?with_genres=${genreID}`,
  configurationDetails: `${TMDB_BASE_URL}/configuration`,
};
async function getFullImagePath(relativePath: string, imageSize: string) {
  const configurationDetails: ConfigurationDetailsResponse = await getTMDBData(TMDB_API_ENDPOINTS.configurationDetails);
  const fullImagePath = `${configurationDetails.images.secure_base_url}${imageSize}${relativePath}`;
  return fullImagePath;
}

export class TMDBApiStreamingContentMetadataProvider extends StreamingContentMetadataProvider {
  async searchMoviesAndShows(searchInput: string): Promise<MoviesAndShows[]> {
    const returnedMoviesAndShows = await getTMDBData(TMDB_API_ENDPOINTS.search(searchInput));
    const moviesAndTVshows: ResultsForMoviesAndTVseries[] = filterOutPeople(returnedMoviesAndShows);
    const streamingContentMetadataArray = await mapToStreamingContentMetadata(moviesAndTVshows);

    return streamingContentMetadataArray;
  }
  async getTrendingStreamingContentMetadata(): Promise<MoviesAndShows[]> {
    const trendingMovies = await getTMDBData(TMDB_API_ENDPOINTS.trending);
    const moviesAndTVshowsArray = filterOutPeople(trendingMovies);
    const trendingMoviesAndShowsArray = await mapToStreamingContentMetadata(moviesAndTVshowsArray);
    return trendingMoviesAndShowsArray;
  }
  async getPopularStreamingContentMetadata(): Promise<MoviesAndShows[]> {
    const popularMovies = (await getTMDBData(TMDB_API_ENDPOINTS.popularMovies)).results.map((movie: MoviesAndShows) => ({
      ...movie,
      media_type: 'movie',
    }));
    const popularShows = (await getTMDBData(TMDB_API_ENDPOINTS.popularTvShows)).results.map((show: MoviesAndShows) => ({
      ...show,
      media_type: 'tv',
    }));

    const moviesAndTVshowsArray = [...popularMovies, ...popularShows];
    const rankedByPopularContent = moviesAndTVshowsArray.sort((a, b) => b.popularity - a.popularity);
    const neededRankedPopularContentData = await mapToStreamingContentMetadata(rankedByPopularContent);

    return neededRankedPopularContentData;
  }
  async getStreamingContentMetadataByGenre(genre: string): Promise<MoviesAndShows[]> {
    const movieGenres = await getTMDBData(TMDB_API_ENDPOINTS.movieGenres);
    const tvShowsGenres = await getTMDBData(TMDB_API_ENDPOINTS.tvShowGenres);

    // Doesn't return with a media type, so have to specify
    const combinedMovieAndTVshowsGenres = [
      ...movieGenres.genres.map((x: Genre) => ({ ...x, media_type: 'movie' })),
      ...tvShowsGenres.genres.map((x: Genre) => ({ ...x, media_type: 'tv' })),
    ];

    // using include because sometimes two genres are put together, e.g Action & Adventure is under same section for tv shows.
    const matchingGenres: ModifiedGenreObject[] = combinedMovieAndTVshowsGenres.filter((x) => x.name.includes(genre));

    const results = await Promise.all(
      matchingGenres.map(async (genre) => {
        const data =
          genre.media_type === 'movie'
            ? await getTMDBData(TMDB_API_ENDPOINTS.moviesWithGenre(genre.id))
            : await getTMDBData(TMDB_API_ENDPOINTS.tvShowsWithGenre(genre.id));
        return mapToStreamingContentMetadata(data.results);
      }),
    );
    return results.flat();
  }
}

async function getTMDBData(url: string) {
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new HTTPError('GET', response.url, response.status, await response.text());
  }
  const body = response.json();
  return body;
}

function filterOutPeople(responseArray: TMDBMultiStreamingContentMetadataResponse) {
  const moviesAndTVshowsArray: ResultsForMoviesAndTVseries[] = responseArray.results.filter((x) => x.media_type !== 'person');
  return moviesAndTVshowsArray;
}

async function mapToStreamingContentMetadata(
  moviesAndTVshowsArray: ResultsForMoviesAndTVseries[] | MovieData[] | TVShowsData[],
): Promise<MoviesAndShows[]> {
  const streamingContentMetadataArray = await Promise.all(
    moviesAndTVshowsArray.map(async (x) => {
      let titleOrName: string;
      let releaseDate: string;
      let mediaType: string;
      let coverImage: string;

      // checking which type of object it is, movie or tv
      if ('title' in x) {
        titleOrName = x.title ?? '';
        releaseDate = x.release_date ?? '';
        mediaType = 'movie';
      } else {
        titleOrName = x.name ?? '';
        releaseDate = x.first_air_date ?? '';
        mediaType = 'show';
      }

      coverImage = x.poster_path ? await getFullImagePath(x.poster_path, 'w185') : '../assets/cover-unavailable.webp';
      const streamingContentMetadata = {
        coverImage: coverImage,
        title: titleOrName,
        description: x.overview,
        releaseDate: releaseDate,
        genreIds: x.genre_ids,
        popularity: x.popularity,
        rating: x.vote_average,
        mediaType: mediaType,
      };

      return streamingContentMetadata;
    }),
  );
  return streamingContentMetadataArray;
}

// interface GenresCallResponse {
//   genres: Genre[];
// }

interface Genre {
  id: number;
  name: string;
}

interface ModifiedGenreObject {
  id: number;
  name: string;
  media_type: string;
}

interface TMDBMultiStreamingContentMetadataResponse {
  page: number;
  results: MultiSearchResults[];
  total_pages: number;
  total_results: number;
}

interface MultiSearchResults {
  backdrop_path?: string;
  id: number;
  name?: string;
  original_name?: string;
  overview: string;
  poster_path?: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;
}

interface ResultsForMoviesAndTVseries {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  first_air_date?: string;
  name?: string;
  release_date?: string;
  title?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  media_type: string;
}
// interface TMDBMultiMovieDataResponse {
//   page: number;
//   results: MovieData[];
//   total_pages: number;
//   total_results: number;
// }
// interface TMDBMultiTVShowsDataResponse {
//   page: number;
//   results: TVShowsData[];
//   total_pages: number;
//   total_results: number;
// }

interface MovieData {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// interface ModifiedMovieData extends MovieData {
//   media_type: string;
// }

interface TVShowsData {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ConfigurationDetailsResponse {
  images: Images;
  change_keys: string[];
}

export interface Images {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

// interface ModifiedTVShowsData extends TVShowsData {
//   media_type: string;
// }
