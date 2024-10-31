import { HTTPError } from '../../src/providers/http-error';
import { StreamingContentMetadataProvider } from '../../src/providers/streaming-content-metadata-provider';
import { TMDBApiStreamingContentMetadataProvider } from '../../src/providers/tmdb-api-streaming-content-metadata-provider';

describe('TMDB API Movie Metadata Provider', () => {
  let provider: StreamingContentMetadataProvider;

  beforeEach(() => {
    provider = new TMDBApiStreamingContentMetadataProvider();
  });

  it('should return movie metadata for an actual movie name is inputted', async () => {
    let movieMetadata = await provider.getStreamingContentMetadata(
      'The lord of the rings',
    );
    expect(movieMetadata).toBeInstanceOf(Array);
  });

  it('should not return anything metadata for nonexistent movie name', async () => {
    let movieMetadata =
      await provider.getStreamingContentMetadata('kerutrqu894gieor');
    expect(movieMetadata).toEqual([]);
  });

  it('should not return anything when no name is provided', async () => {
    let movieMetadata = await provider.getStreamingContentMetadata('');
    expect(movieMetadata).toEqual([]);
  });

  it('should not return anything when no name is provided', async () => {
    import.meta.env.VITE_READ_ACCESS_TOKEN = 'INVALID ACCESS TOKEN';

    try {
      await provider.getStreamingContentMetadata('');
      throw new Error('Should have rejected');
    } catch (e) {
      expect(e).toBeInstanceOf(HTTPError);
    }
  });
});
