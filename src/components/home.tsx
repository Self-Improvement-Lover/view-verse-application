import { useEffect, useState, useRef } from 'react';
import { MoviesAndShows, StreamingContentMetadataProvider } from '../providers/streaming-content-metadata-provider';
import { AppTestIds } from '../App';
import './home.css';
import { getRatingColour, roundTo1DP } from '../utils/utils';
type HomeProps = {
  streamingContentMetadataProvider: StreamingContentMetadataProvider;
};

export function Home({ streamingContentMetadataProvider }: HomeProps) {
  const [trendingStreamingContentMetadata, setTrendingStreamingContentMetadata] = useState<MoviesAndShows[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isScrollLeftButtonDisabled, setIsScrollLeftButtonDisabled] = useState(true);
  const [isScrollRightButtonDisabled, setIsScrollRightButtonDisabled] = useState(false);

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

  function checkScrollButtons() {


    if (carouselRef.current) {
      const currentScrollPosition = carouselRef.current.scrollLeft; 
      const possibleMaxScrollAmount = carouselRef.current.scrollWidth - carouselRef.current.clientWidth; 
      setIsScrollLeftButtonDisabled(currentScrollPosition === 0); 
      setIsScrollRightButtonDisabled(currentScrollPosition >= possibleMaxScrollAmount); 
    }

  }

  useEffect(() => {
    console.log('isScrollLeftButtonDisabled:', isScrollLeftButtonDisabled);
  }, [isScrollLeftButtonDisabled]); 

  useEffect(() => {
    console.log('isScrollRightButtonDisabled:', isScrollRightButtonDisabled);
  }, [isScrollRightButtonDisabled]); 
  
  async function handleScroll(direction: 'left' | 'right') {
    
    if (carouselRef.current) {
      console.log(carouselRef.current.scrollLeft);
      const scrollAmount = direction === 'left' ? -600 : 600;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  
      // use setTimeout to wait for the smooth effect to finish first and then update scrollButtons
      await new Promise((r) => setTimeout(r, 500));

      checkScrollButtons();
    }
  }

  return (
    <main data-testid={AppTestIds.home}>
      <div className="streaming-category" data-testid={HomeTestIds.trendingCategory}>
        <h2 className="streaming-category__header">Trending</h2>
        <div className="streaming-category__carousel">
          <button
            className="streaming-category__carousel-left-button"
            onClick={() => handleScroll('left')}
            data-testid={TrendingTestIds.trendingCarouselLeftButton}
            disabled={isScrollLeftButtonDisabled}
          >
            &lt;
          </button>
          <div className="streaming-category__content-row" ref={carouselRef} data-testid={TrendingTestIds.carouselContainer}>
            {trendingStreamingContentMetadata.map((x) => {
              return (
                <div className="streaming-category__content" data-testid={TrendingTestIds.trendingContent}>
                  <img
                    src={x.coverImage}
                    alt="Cover Image"
                    className="streaming-category__image"
                    data-testid={TrendingTestIds.trendingContentImage}
                  />
                  <span
                    className={`streaming-category__media-type ${x.mediaType === 'movie' ? 'movie' : 'show'}`}
                    data-testid={TrendingTestIds.trendingContentMediaType}
                  >
                    {x.mediaType}
                  </span>
                  <div className="streaming-category__footer-container">
                    <span className="streaming-category__title" data-testid={TrendingTestIds.trendingContentTitle}>
                      {x.title.length > 30 ? x.title.slice(0, 30) + '...' : x.title}
                    </span>
                    <span className={`streaming-category__rating ${getRatingColour(x.rating)}`} data-testid={TrendingTestIds.trendingContentRating}>
                      {roundTo1DP(x.rating)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="streaming-category__carousel-right-button"
            onClick={() => handleScroll('right')}
            data-testid={TrendingTestIds.trendingCarouselRightButton}
            disabled={isScrollRightButtonDisabled}
          >
            &gt;
          </button>
        </div>
      </div>
    </main>
  );
}
// TODO: PUT RIGHT AND LEFT CAROUSEL BUTTONS OON CORRECT TEST IDS
export const HomeTestIds = {
  home: 'home-test-id-home',
  trendingCategory: 'home-test-id-trending-category',
  carouselContainer: 'trending-test-id-trending-content-carousel-container',
};

export const TrendingTestIds = {
  trendingContent: 'trending-test-id-trending-content',
  trendingContentImage: 'trending-test-id-trending-content-image',
  trendingContentTitle: 'trending-test-id-trending-content-title',
  trendingContentRating: 'trending-test-id-trending-content-rating',
  trendingContentMediaType: 'trending-test-id-trending-content-media-type',
  carouselContainer: 'trending-test-id-trending-content-carousel-container',
  trendingCarouselLeftButton: 'trending-test-id-trending-content-carousel-left-button',
  trendingCarouselRightButton: 'trending-test-id-trending-content-carousel-right-button',
};
