import {
  StreamingContentMetadata,
  StreamingContentMetadataProvider,
} from './streaming-content-metadata-provider';
import { HTTPError } from './http-error';

export class TMDBApiStreamingContentMetadataProvider extends StreamingContentMetadataProvider {
  async getStreamingContentMetadata(
    searchInput: string,
  ): Promise<StreamingContentMetadata[]> {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${searchInput}`,
      {
        headers: {
          authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      throw new HTTPError(
        'GET',
        response.url,
        response.status,
        await response.text(),
      );
    }

    const body: TMDBMultiStreamingContentMetadataResponse = await response.json();
    const moviesAndTVshows: ResultsForMoviesAndTVseries[] = body.results.filter(
      (x) => x.media_type !== 'person',
    );
    
    const streamingContentMetadataArray = moviesAndTVshows.map((x) => {
      const streamingContentMetadata = {
        coverImage: x.poster_path || '../assets/cover-unavailable.webp',
        title: (x.title || x.name) as string,
        description: x.overview,
        releaseDate: (x.release_date || x.first_air_date) as string,
        genreIds: x.genre_ids,
        rating: x.vote_average,
        mediaType: x.media_type,
      };

      return streamingContentMetadata;
    });

    return streamingContentMetadataArray;
  }
}

// TODO: COMPLETE THIS 
function getMovieGenresByTMDBId(array: number[]){
const response = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YWU1OThmYzFkNzg2MDZlNDFhZGYzY2U3MGE2MjRiMyIsIm5iZiI6MTczMDI5MTEzNy4zODkzNjE0LCJzdWIiOiI2NmZkMTc0MjYzMjlkMDMyZDhkMDZjMGQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7LQ_boD8eqS10nIlD8a_7gt84CKOLupWTYDEATzw_Bk',
  },
};
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
  media_type: string
}

 
