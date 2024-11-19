import { HTTPError } from '../../src/providers/http-error';
import { StreamingContentMetadataProvider } from '../../src/providers/streaming-content-metadata-provider';
import { TMDBApiStreamingContentMetadataProvider } from '../../src/providers/tmdb-api-streaming-content-metadata-provider';

describe.skip('TMDB API Streaming Content Metadata Provider', () => {
  let provider: StreamingContentMetadataProvider;
  const originalToken = import.meta.env.VITE_READ_ACCESS_TOKEN;
  let streamingContentMetadataShape = {
    coverImage: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    releaseDate: expect.any(String),
    genreIds: expect.any(Array),
    popularity: expect.any(Number),
    rating: expect.any(Number),
    mediaType: expect.any(String),
  };

  beforeEach(() => {
    provider = new TMDBApiStreamingContentMetadataProvider();
  });

  afterEach(() => {
    jest.clearAllMocks();
    import.meta.env.VITE_READ_ACCESS_TOKEN = originalToken;
  });

  describe('Searching call response', () => {
    it('should return streaming content metadata for an actual name is inputted', async () => {
      let streamingContentMetadata = await provider.searchMoviesAndShows('The lord of the rings');
      expect(streamingContentMetadata).toBeInstanceOf(Array);
    });

    it('should not return anything metadata for nonexistent streaming content name', async () => {
      let streamingContentMetadata = await provider.searchMoviesAndShows('kerutrqu894gieor');
      expect(streamingContentMetadata).toEqual([]);
    });

    it('should not return anything when no name is provided', async () => {
      let streamingContentMetadata = await provider.searchMoviesAndShows('');
      expect(streamingContentMetadata).toEqual([]);
    });

    it('should not return anything when no name is provided', async () => {
      import.meta.env.VITE_READ_ACCESS_TOKEN = 'INVALID ACCESS TOKEN';
      try {
        await provider.searchMoviesAndShows('The lord of the rings');
        throw new Error('Should have rejected');
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }
      import.meta.env.VITE_READ_ACCESS_TOKEN = originalToken;
    });
  });

  describe('Retrieving trending movies and shows', () => {
    it('should return trending streaming content metadata when called', async () => {
      const trendingMoviesAndShows = await provider.getTrendingStreamingContentMetadata();
      expect(trendingMoviesAndShows).toBeInstanceOf(Array);
      trendingMoviesAndShows.forEach((x) => {
        expect(x).toMatchObject(streamingContentMetadataShape);
      });
    });

    it('should not throw error when response comes back as not OK', async () => {
      import.meta.env.VITE_READ_ACCESS_TOKEN = 'INVALID ACCESS TOKEN';

      try {
        await provider.getTrendingStreamingContentMetadata();
        throw new Error('Should have rejected');
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }

      import.meta.env.VITE_READ_ACCESS_TOKEN = originalToken;
    });
  });

  describe('Retrieving popular movies and shows', () => {
    it('should return the most popular streaming content metadata in descending order', async () => {
      const popularStreamingContentMetadata = await provider.getPopularStreamingContentMetadata();

      popularStreamingContentMetadata.forEach((x) => {
        expect(x).toMatchObject(streamingContentMetadataShape);
      });

      expect(isDescending(popularStreamingContentMetadata, 'popularity')).toBe(true);
    });

    it('should not throw error when response comes back as not Ok', async () => {
      import.meta.env.VITE_READ_ACCESS_TOKEN = 'INVALID ACCESS TOKEN';

      try {
        await provider.getPopularStreamingContentMetadata();
        throw new Error('Should have rejected');
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }

      import.meta.env.VITE_READ_ACCESS_TOKEN = originalToken;
    });
  });

  describe('Retrieving streaming content metadata by genre', () => {
    // TODO:UPDATE THIS TESTS,JUST CURRENTLY COPIED AND PASTED IT
    it('should return streaming content metadata with matching genres called for', async () => {
      const movieActionGenreId = 28;
      const tvShowActionGenreId = 10759;
      let moviesAndShows = await provider.getStreamingContentMetadataByGenre('Action');
      expect(moviesAndShows).toBeInstanceOf(Array);
      moviesAndShows.forEach((x) => {
        expect(x).toMatchObject(streamingContentMetadataShape);
        const containsActionId = x.genreIds.includes(movieActionGenreId) || x.genreIds.includes(tvShowActionGenreId);
        expect(containsActionId).toBe(true);
      });
    });

    xit('should not return anything metadata for nonexistent streaming content name', async () => {
      let streamingContentMetadata = await provider.searchMoviesAndShows('kerutrqu894gieor');
      expect(streamingContentMetadata).toEqual([]);
    });

    xit('should not return anything when no name is provided', async () => {
      let streamingContentMetadata = await provider.searchMoviesAndShows('');
      expect(streamingContentMetadata).toEqual([]);
    });

    xit('should not return anything when no name is provided', async () => {
      import.meta.env.VITE_READ_ACCESS_TOKEN = 'INVALID ACCESS TOKEN';

      try {
        await provider.searchMoviesAndShows('');
        throw new Error('Should have rejected');
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }

      import.meta.env.VITE_READ_ACCESS_TOKEN = originalToken;
    });
  });
});

function isDescending(array: any[], property: string) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i].property < array[i + 1].property) {
      return false;
    }
  }
  return true;
}
