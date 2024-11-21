import { RenderResult, render } from '@testing-library/react';
import { App } from '../src/App';
import { AppPageObject } from './page-objects/app-page-object';
import { StreamingContentMetadataProvider } from '../src/providers/streaming-content-metadata-provider';
import { TMDBApiStreamingContentMetadataProvider } from '../src/providers/tmdb-api-streaming-content-metadata-provider';

describe('Main Page Different Streaming Content Displays', () => {
  let streamingContentMetadataProvider: StreamingContentMetadataProvider;
  let app: AppPageObject;
  let renderedApp: RenderResult;
  let trendingStreamingContentMetadata = [
    {
      coverImage: 'http://image.tmdb.org/t/p/w500/streamingContentMock1',
      title: 'Streaming Content Mock data 1',
      description: 'A mock of streaming content metadata',
      releaseDate: '2020',
      genreIds: [1, 2],
      popularity: 1,
      rating: 1,
      mediaType: 'movie',
    },
    {
      coverImage: 'http://image.tmdb.org/t/p/w500/streamingContentMock2',
      title: 'Streaming Content Mock data 2',
      description: 'A mock of streaming content metadata 2nd version',
      releaseDate: '2020',
      genreIds: [3, 4],
      popularity: 2,
      rating: 2,
      mediaType: 'tv',
    },
    {
      coverImage: 'http://image.tmdb.org/t/p/w500/streamingContentMock3',
      title: 'Streaming Content Mock data 3',
      description: 'A mock of streaming content metadata 3rd version',
      releaseDate: '2020',
      genreIds: [5, 6],
      popularity: 3,
      rating: 3,
      mediaType: 'movie',
    },
  ];

  describe('trending streaming content metadata display', () => {
    beforeEach(async () => {
      streamingContentMetadataProvider = new TMDBApiStreamingContentMetadataProvider();
      jest.spyOn(streamingContentMetadataProvider, 'getTrendingStreamingContentMetadata').mockResolvedValue(trendingStreamingContentMetadata);
      renderedApp = render(<App streamingContentMetadataProvider={streamingContentMetadataProvider} />);
      app = new AppPageObject(renderedApp.baseElement);
      await new Promise((r) => setTimeout(r, 50));
    });

    it('should have a trending movie and shows section', () => {
      expect(app.home.trending.getAllTrendingStreamingContent).toBeTruthy();
    });

    it('should have a correct number streaming content displayed', () => {
      expect(app.home.trending.getAllTrendingStreamingContent).toHaveLength(3);
    });

    it('should show correct metadata for the streaming content', () => {
      for (let i = 0; i < trendingStreamingContentMetadata.length; i++) {
        expect(app.home.trending.getAllTrendingStreamingContent[i].coverImage.src).toEqual(trendingStreamingContentMetadata[i].coverImage);
        expect(app.home.trending.getAllTrendingStreamingContent[i].title.text).toEqual(trendingStreamingContentMetadata[i].title);
        expect(app.home.trending.getAllTrendingStreamingContent[i].rating.text).toEqual(String(trendingStreamingContentMetadata[i].rating));
        expect(app.home.trending.getAllTrendingStreamingContent[i].mediaType.text).toEqual(trendingStreamingContentMetadata[i].mediaType);
      }
    });


  });
});
