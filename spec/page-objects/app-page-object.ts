import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import { AppTestIds } from '../../src/App';
import { HomeTestIds, TrendingTestIds } from '../../src/components/home';

export class AppPageObject {
  constructor(private element: HTMLElement) {}

  get home() {
    return new HomePageObject(queryByTestId(this.element, AppTestIds.home) as HTMLElement);
  }
}

export class HomePageObject {
  constructor(private element: HTMLElement) {}

  get trending() {
    return new TrendingStreamingContentPageObject(queryByTestId(this.element, HomeTestIds.trendingCategory) as HTMLElement);
  }
}
// Get the trending section, then get each trending movie or show, and for each give them their
// TODO: RUBBISH NAMING, THIS CAN MAKE YOU CONFUSED WITH IT BEING THE PAGE OBJECT FOR WHEN YOU CLICK ON ONE OF THE
// POSTERS.
export class TrendingStreamingContentPageObject {
  constructor(private element: HTMLElement) {}

  get getAllTrendingStreamingContent() {
    return (queryAllByTestId(this.element, TrendingTestIds.trendingContent) as HTMLElement[]).map(
      (x) => new TrendingStreamingContentMetadataPageObject(x),
    );
  }
}

export class TrendingStreamingContentMetadataPageObject {
  constructor(private element: HTMLElement) {}

  get coverImage() {
    return new ImagePageObject(queryByTestId(this.element, TrendingTestIds.trendingContentImage) as HTMLImageElement);
  }
  get title() {
    return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentTitle) as HTMLElement);
  }
  
  get rating() {
    return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentRating) as HTMLElement);
  }
  get mediaType() {
    return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentMediaType) as HTMLElement);
  }
}

export class ElementPageObject {
  constructor(private element: HTMLElement) {}

  get text() {
    return this.element.textContent;
  }
}

export class ImagePageObject {
  constructor(private element: HTMLImageElement) {}

  get src() {
    return this.element.src;
  }
}
