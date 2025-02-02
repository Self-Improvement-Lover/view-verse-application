import { fireEvent, queryAllByTestId, queryByTestId } from '@testing-library/react';
import { AppTestIds } from '../../App';
import { HomeTestIds, TrendingTestIds } from '../../components/home';
export class AppPageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get home() {
        return new HomePageObject(queryByTestId(this.element, AppTestIds.home));
    }
}
export class HomePageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get trending() {
        console.log(queryByTestId(this.element, TrendingTestIds.trendingCarouselLeftButton));
        return new CarouselPageObject(this.element, queryByTestId(this.element, TrendingTestIds.trendingCarouselLeftButton), queryByTestId(this.element, TrendingTestIds.trendingCarouselRightButton));
        // TrendingStreamingContentPageObject(queryByTestId(this.element, HomeTestIds.trendingCategory) as HTMLElement);
    }
}
// Get the trending section, then get each trending movie or show, and for each give them their
// TODO: RUBBISH NAMING, THIS CAN MAKE YOU CONFUSED WITH IT BEING THE PAGE OBJECT FOR WHEN YOU CLICK ON ONE OF THE
// POSTERS.
export class TrendingStreamingContentPageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get getAllTrendingStreamingContent() {
        return queryAllByTestId(this.element, TrendingTestIds.trendingContent).map((x) => new TrendingStreamingContentMetadataPageObject(x));
    }
}
export class TrendingStreamingContentMetadataPageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get coverImage() {
        return new ImagePageObject(queryByTestId(this.element, TrendingTestIds.trendingContentImage));
    }
    get title() {
        return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentTitle));
    }
    get rating() {
        return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentRating));
    }
    get mediaType() {
        return new ElementPageObject(queryByTestId(this.element, TrendingTestIds.trendingContentMediaType));
    }
}
export class ElementPageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get text() {
        return this.element.textContent;
    }
}
export class ImagePageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    get src() {
        return this.element.src;
    }
}
export class CarouselPageObject {
    constructor(element, carouselLeftButton, carouselRightButton) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
        Object.defineProperty(this, "carouselLeftButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: carouselLeftButton
        });
        Object.defineProperty(this, "carouselRightButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: carouselRightButton
        });
    }
    get content() {
        return new TrendingStreamingContentPageObject(queryByTestId(this.element, HomeTestIds.trendingCategory));
    }
    get scrollPosition() {
        return this.element.scrollLeft;
    }
    get scrollLeftButton() {
        console.log(this.carouselLeftButton);
        return new ButtonPageObject(this.carouselLeftButton);
    }
    get scrollRightButton() {
        console.log(this.element);
        return new ButtonPageObject(this.carouselRightButton);
    }
}
export class ButtonPageObject {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
    }
    click() {
        console.log(this.element);
        console.log(this.element);
        fireEvent.click(this.element);
    }
    get isDisabled() {
        return this.element.disabled;
    }
}
/**
 get this left button working. finsih setting up the rest of the tests
 loasds the rest of the themes and yeah, make it look good
 */
