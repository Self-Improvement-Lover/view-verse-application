import { StreamingContentMetadataProvider } from './streaming-content-metadata-provider';
import { HTTPError } from './http-error';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_ENDPOINTS = {
    search: (query) => `${TMDB_BASE_URL}/search/multi?query=${query}`,
    trending: `${TMDB_BASE_URL}/trending/all/day`,
    popularMovies: `${TMDB_BASE_URL}/movie/popular`,
    popularTvShows: `${TMDB_BASE_URL}/tv/popular`,
    movieGenres: `${TMDB_BASE_URL}/genre/movie/list`,
    tvShowGenres: `${TMDB_BASE_URL}/genre/tv/list`,
    moviesWithGenre: (genreID) => `${TMDB_BASE_URL}/discover/movie?with_genres=${genreID}`,
    tvShowsWithGenre: (genreID) => `${TMDB_BASE_URL}/discover/tv?with_genres=${genreID}`,
    configurationDetails: `${TMDB_BASE_URL}/configuration`,
};
async function getFullImagePath(relativePath, imageSize) {
    const configurationDetails = await getTMDBData(TMDB_API_ENDPOINTS.configurationDetails);
    const fullImagePath = `${configurationDetails.images.secure_base_url}${imageSize}${relativePath}`;
    return fullImagePath;
}
export class TMDBApiStreamingContentMetadataProvider extends StreamingContentMetadataProvider {
    async searchMoviesAndShows(searchInput) {
        const returnedMoviesAndShows = await getTMDBData(TMDB_API_ENDPOINTS.search(searchInput));
        const moviesAndTVshows = filterOutPeople(returnedMoviesAndShows);
        const streamingContentMetadataArray = await mapToStreamingContentMetadata(moviesAndTVshows);
        return streamingContentMetadataArray;
    }
    async getTrendingStreamingContentMetadata() {
        const trendingMovies = await getTMDBData(TMDB_API_ENDPOINTS.trending);
        const moviesAndTVshowsArray = filterOutPeople(trendingMovies);
        const trendingMoviesAndShowsArray = await mapToStreamingContentMetadata(moviesAndTVshowsArray);
        return trendingMoviesAndShowsArray;
    }
    async getPopularStreamingContentMetadata() {
        const popularMovies = (await getTMDBData(TMDB_API_ENDPOINTS.popularMovies)).results.map((movie) => ({
            ...movie,
            media_type: 'movie',
        }));
        const popularShows = (await getTMDBData(TMDB_API_ENDPOINTS.popularTvShows)).results.map((show) => ({
            ...show,
            media_type: 'tv',
        }));
        const moviesAndTVshowsArray = [...popularMovies, ...popularShows];
        const rankedByPopularContent = moviesAndTVshowsArray.sort((a, b) => b.popularity - a.popularity);
        const neededRankedPopularContentData = await mapToStreamingContentMetadata(rankedByPopularContent);
        return neededRankedPopularContentData;
    }
    async getStreamingContentMetadataByGenre(genre) {
        const movieGenres = await getTMDBData(TMDB_API_ENDPOINTS.movieGenres);
        const tvShowsGenres = await getTMDBData(TMDB_API_ENDPOINTS.tvShowGenres);
        // Doesn't return with a media type, so have to specify
        const combinedMovieAndTVshowsGenres = [
            ...movieGenres.genres.map((x) => ({ ...x, media_type: 'movie' })),
            ...tvShowsGenres.genres.map((x) => ({ ...x, media_type: 'tv' })),
        ];
        // using include because sometimes two genres are put together, e.g Action & Adventure is under same section for tv shows.
        const matchingGenres = combinedMovieAndTVshowsGenres.filter((x) => x.name.includes(genre));
        const results = await Promise.all(matchingGenres.map(async (genre) => {
            const data = genre.media_type === 'movie'
                ? await getTMDBData(TMDB_API_ENDPOINTS.moviesWithGenre(genre.id))
                : await getTMDBData(TMDB_API_ENDPOINTS.tvShowsWithGenre(genre.id));
            return mapToStreamingContentMetadata(data.results);
        }));
        return results.flat();
    }
}
async function getTMDBData(url) {
    const response = await fetch(url, {
        headers: {
            authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new HTTPError('GET', response.url, response.status, await response.text());
    }
    const body = response.json();
    return body;
}
function filterOutPeople(responseArray) {
    const moviesAndTVshowsArray = responseArray.results.filter((x) => x.media_type !== 'person');
    return moviesAndTVshowsArray;
}
async function mapToStreamingContentMetadata(moviesAndTVshowsArray) {
    const streamingContentMetadataArray = await Promise.all(moviesAndTVshowsArray.map(async (x) => {
        let titleOrName;
        let releaseDate;
        let mediaType;
        let coverImage;
        // checking which type of object it is, movie or tv
        if ('title' in x) {
            titleOrName = x.title ?? '';
            releaseDate = x.release_date ?? '';
            mediaType = 'movie';
        }
        else {
            titleOrName = x.name ?? '';
            releaseDate = x.first_air_date ?? '';
            mediaType = 'show';
        }
        coverImage = x.poster_path ? await getFullImagePath(x.poster_path, 'w185') : '../assets/cover-unavailable.webp';
        const streamingContentMetadata = {
            coverImage: coverImage,
            title: titleOrName,
            description: x.overview,
            releaseDate: releaseDate,
            genreIds: x.genre_ids,
            popularity: x.popularity,
            rating: x.vote_average,
            mediaType: mediaType,
        };
        return streamingContentMetadata;
    }));
    return streamingContentMetadataArray;
}
// interface ModifiedTVShowsData extends TVShowsData {
//   media_type: string;
// }
