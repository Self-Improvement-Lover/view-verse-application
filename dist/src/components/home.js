import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { AppTestIds } from '../App';
import './home.css';
import { getRatingColour, roundTo1DP } from '../utils/utils';
export function Home({ streamingContentMetadataProvider }) {
    const [trendingStreamingContentMetadata, setTrendingStreamingContentMetadata] = useState([]);
    const carouselRef = useRef(null);
    const [isScrollLeftButtonDisabled, setIsScrollLeftButtonDisabled] = useState(true);
    const [isScrollRightButtonDisabled, setIsScrollRightButtonDisabled] = useState(false);
    useEffect(() => {
        async function getTrendingMoviesAndShows() {
            try {
                const trendingStreamingContentMetadata = await streamingContentMetadataProvider.getTrendingStreamingContentMetadata();
                setTrendingStreamingContentMetadata(trendingStreamingContentMetadata);
            }
            catch (e) {
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
    async function handleScroll(direction) {
        if (carouselRef.current) {
            console.log(carouselRef.current.scrollLeft);
            const scrollAmount = direction === 'left' ? -600 : 600;
            console.log(direction);
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            // use setTimeout to wait for the smooth effect to finish first and then update scrollButtons
            await new Promise((r) => setTimeout(r, 500));
            checkScrollButtons();
        }
    }
    return (_jsx("main", { "data-testid": AppTestIds.home, children: _jsxs("div", { className: "streaming-category", "data-testid": HomeTestIds.trendingCategory, children: [_jsx("h2", { className: "streaming-category__header", children: "Trending" }), _jsxs("div", { className: "streaming-category__carousel", children: [_jsx("button", { className: "streaming-category__carousel-left-button", onClick: () => handleScroll('left'), "data-testid": TrendingTestIds.trendingCarouselLeftButton, disabled: isScrollLeftButtonDisabled, children: "<" }), _jsx("div", { className: "streaming-category__content-row", ref: carouselRef, "data-testid": TrendingTestIds.carouselContainer, children: trendingStreamingContentMetadata.map((x) => {
                                return (_jsxs("div", { className: "streaming-category__content", "data-testid": TrendingTestIds.trendingContent, children: [_jsx("img", { src: x.coverImage, alt: "Cover Image", className: "streaming-category__image", "data-testid": TrendingTestIds.trendingContentImage }), _jsx("span", { className: `streaming-category__media-type ${x.mediaType === 'movie' ? 'movie' : 'show'}`, "data-testid": TrendingTestIds.trendingContentMediaType, children: x.mediaType }), _jsxs("div", { className: "streaming-category__footer-container", children: [_jsx("span", { className: "streaming-category__title", "data-testid": TrendingTestIds.trendingContentTitle, children: x.title.length > 30 ? x.title.slice(0, 30) + '...' : x.title }), _jsx("span", { className: `streaming-category__rating ${getRatingColour(x.rating)}`, "data-testid": TrendingTestIds.trendingContentRating, children: roundTo1DP(x.rating) })] })] }));
                            }) }), _jsx("button", { className: "streaming-category__carousel-right-button", onClick: () => handleScroll('right'), "data-testid": TrendingTestIds.trendingCarouselRightButton, disabled: isScrollRightButtonDisabled, children: ">" })] })] }) }));
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
