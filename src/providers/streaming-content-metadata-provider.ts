export abstract class StreamingContentMetadataProvider {
  abstract searchMoviesAndShows(text: string): Promise<MoviesAndShows[]>;
  abstract getTrendingStreamingContentMetadata(): Promise<MoviesAndShows[]>;
  abstract getPopularStreamingContentMetadata(): Promise<MoviesAndShows[]>;
  abstract getStreamingContentMetadataByGenre(text: string): Promise<MoviesAndShows[]>;
}

export interface MoviesAndShows {
  coverImage: string;
  title: string;
  description: string;
  releaseDate: string;
  genreIds: number[];
  popularity: number;
  rating: number;
  mediaType: string;
}
