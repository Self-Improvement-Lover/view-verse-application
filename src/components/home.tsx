import { useEffect, useState } from 'react';
import { MoviesAndShows, StreamingContentMetadataProvider } from '../providers/streaming-content-metadata-provider';
import { AppTestIds } from '../App';
import './home.css';
import { getRatingColour, roundTo1DP } from '../utils/utils';
type HomeProps = {
  streamingContentMetadataProvider: StreamingContentMetadataProvider;
};
export function Home({ streamingContentMetadataProvider }: HomeProps) {
  const [trendingStreamingContentMetadata, setTrendingStreamingContentMetadata] = useState<MoviesAndShows[]>([]);

  useEffect(() => {
    async function getTrendingMoviesAndShows() {
      try {
        const trendingStreamingContentMetadata = await streamingContentMetadataProvider.getTrendingStreamingContentMetadata();
        setTrendingStreamingContentMetadata(trendingStreamingContentMetadata);
      } catch (e) {
        console.error(e);
      }
    }
    getTrendingMoviesAndShows();
  }, []);

  return (
    <main data-testid={AppTestIds.home}>
      <div className="streaming-category" data-testid={HomeTestIds.trendingCategory}>
        <h2 className="streaming-category__header">Trending</h2>

        <div className="streaming-category__content-row">
          {trendingStreamingContentMetadata.map((x) => {
            return (
              <div className="streaming-category__content" data-testid={TrendingTestIds.trendingContent}>
                <img src={x.coverImage} alt="Cover Image" className="streaming-category__image" data-testid={TrendingTestIds.trendingContentImage} />
                <span
                  className={`streaming-category__media-type ${x.mediaType === 'movie' ? 'movie' : 'show'}`}
                  data-testid={TrendingTestIds.trendingContentMediaType}
                >
                  {x.mediaType}
                </span>
                <div className="streaming-category__footer-container">
                  <span className="streaming-category__title" data-testid={TrendingTestIds.trendingContentTitle}>
                    {x.title.length > 50 ? x.title.slice(0, 50) + '...' : x.title}
                  </span>
                  <span className={`streaming-category__rating ${getRatingColour(x.rating)}`} data-testid={TrendingTestIds.trendingContentRating}>
                    {roundTo1DP(x.rating)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export const HomeTestIds = {
  home: 'home-test-id-home',
  trendingCategory: 'home-test-id-trending-category',
};

export const TrendingTestIds = {
  trendingContent: 'trending-test-id-trending-content',
  trendingContentImage: 'trending-test-id-trending-content-image',
  trendingContentTitle: 'trending-test-id-trending-content-title',
  trendingContentRating: 'trending-test-id-trending-content-rating',
  trendingContentMediaType: 'trending-test-id-trending-content-media-type',
};
