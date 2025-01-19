import { RenderResult, fireEvent, getByTestId, render, waitFor } from '@testing-library/react';
import { App } from '../src/App';
import { AppPageObject } from './page-objects/app-page-object';
import { StreamingContentMetadataProvider } from '../src/providers/streaming-content-metadata-provider';
import { TMDBApiStreamingContentMetadataProvider } from '../src/providers/tmdb-api-streaming-content-metadata-provider';
import React, { act, useEffect, useRef } from 'react';

describe('Main Page Different Streaming Content Displays', () => {
  let streamingContentMetadataProvider: StreamingContentMetadataProvider;
  let app: AppPageObject;
  let renderedApp: RenderResult;
  const trendingStreamingContentMetadata = [
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

  let carouselRefMock: React.RefObject<HTMLDivElement>;

  describe('trending streaming content metadata display', () => {
    beforeEach(async () => {
      streamingContentMetadataProvider = new TMDBApiStreamingContentMetadataProvider();

      carouselRefMock = {
        current: {
          scrollLeft: 0,
        },
      };

      Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
        configurable: true,
        value: jest.fn(({ left }: { left: number }) => {
          if (carouselRefMock.current.scrollLeft < 3600) {
            carouselRefMock.current.scrollLeft += left;
          }
        }),
      });

      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get: jest.fn(() => 600),
      });

      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get: jest.fn(() => 3600),
      });

      jest.spyOn(React, 'useRef').mockReturnValue(carouselRefMock);

      jest.spyOn(streamingContentMetadataProvider, 'getTrendingStreamingContentMetadata').mockResolvedValue(trendingStreamingContentMetadata);

      renderedApp = render(<App streamingContentMetadataProvider={streamingContentMetadataProvider} />);
      app = new AppPageObject(renderedApp.baseElement);
      await new Promise((r) => setTimeout(r, 50));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should have a trending movie and shows section', () => {
      expect(app.home.trending.content.getAllTrendingStreamingContent).toBeTruthy();
    });

    it('should have the correct number of streaming content displayed', () => {
      expect(app.home.trending.content.getAllTrendingStreamingContent).toHaveLength(3);
    });

    it('should show correct metadata for the streaming content', () => {
      for (let i = 0; i < trendingStreamingContentMetadata.length; i++) {
        expect(app.home.trending.content.getAllTrendingStreamingContent[i].coverImage.src).toEqual(trendingStreamingContentMetadata[i].coverImage);
        expect(app.home.trending.content.getAllTrendingStreamingContent[i].title.text).toEqual(trendingStreamingContentMetadata[i].title);
        expect(app.home.trending.content.getAllTrendingStreamingContent[i].rating.text).toEqual(String(trendingStreamingContentMetadata[i].rating));
        expect(app.home.trending.content.getAllTrendingStreamingContent[i].mediaType.text).toEqual(trendingStreamingContentMetadata[i].mediaType);
      }
    });

    describe('When carousel buttons are pressed', () => {
      it('should have left button disabled when at the beginning of the carousel', () => {
        expect(app.home.trending.scrollLeftButton.isDisabled).toBe(true);
      });

      it('should have the right button not disabled', () => {
        expect(app.home.trending.scrollRightButton.isDisabled).toBe(false);
      });

      describe('When right carousel button is pressed', () => {
        beforeEach(() => {
          act(() => {
            app.home.trending.scrollRightButton.click();
          });
        });

        it('should scroll to the right', async () => {
          await act(async () => {
            expect(carouselRefMock.current.scrollLeft).toBe(600);
          });
        });

        it('should enable the left button', async () => {
          await waitFor(async () => {
            expect(app.home.trending.scrollLeftButton.isDisabled).toBe(false);
          });
        });

        describe('When at the end of the right side of the carousel', () => {
          beforeEach(async () => {
            await waitFor(() => {
              for (let i = 0; i <= 3; i++) {
                app.home.trending.scrollRightButton.click();
              }
            });
          });

          it('should scroll be at the end of the carousel', async () => {
            await act(async () => {
              expect(carouselRefMock.current.scrollLeft).toBe(3000);
            });
          });

          it('should disable the right button', async () => {
            await waitFor(() => {
              expect(app.home.trending.scrollRightButton.isDisabled).toBe(true);
            });
          });

          it('should have the left button be enabled', async () => {
            await waitFor(() => {
              expect(app.home.trending.scrollLeftButton.isDisabled).toBe(false);
            });
          });

          describe('When moving pressing left carousel button when at the end of the right side carousel', () => {
            beforeEach(async () => {
              await waitFor(() => {
                app.home.trending.scrollLeftButton.click();
              });
            });

            it('should scroll to the left', async () => {
              await waitFor(async () => {
                expect(carouselRefMock.current.scrollLeft).toBe(2400);
              });
            });

            it('should enable the right button', async () => {
              await waitFor(() => {
                expect(app.home.trending.scrollRightButton.isDisabled).toBe(false);
              });
            });
          });
        });
      });
    });
  });
});
