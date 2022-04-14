import { waitForNone } from "recoil";

const BASE_URL = process.env.REACT_APP_BASE_URL
const API_KEY = process.env.REACT_APP_API_KEY

// 타입정의
interface IMovie {
    id : number;
    genre_ids : number[],
    origin_country : string[];
    original_language : string;
    backdrop_path : string;
    poster_path : string;
    title : string;
    overview : string;
    release_date : string;
    vote_average : number;
}

interface ITv {
    id : number;
    genre_ids : number[],
    origin_country : string[];
    original_language : string;
    backdrop_path : string;
    poster_path : string;
    name : string;
    overview : string;
    first_air_date : string;
    vote_average : number;
}

interface ITrend {
    id : number;
    origin_country : string[];
    original_language : string;
    backdrop_path : string;
    poster_path : string;
    name : string;
    title : string;
    overview : string;
    release_date : string;
    first_air_date : string;
    vote_average : number;
    media_type : string;
}

export interface IClip {
    iso_639_1: string,
    iso_3166_1: string,
    name: string,
    key: string,
    site: string,
    size: number,
    type: string,
    official: boolean,
    published_at: string,
    id: string
}

export interface IGenre {
    id : number;
    name : string;
}

export interface IKeyword {
    id : number;
    name : string;
}

export interface ITvSeason {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
}

export interface ICast {
    gender: number;
    id: number;
    name: string;
    original_name: string;
    profile_path: string
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export interface ICrew {
    gender: number;
    id: number;
    name: string;
    original_name: string;
    department : string;
    known_for_department: string;
    job: string;
}

export interface IEpisode {
    air_date: string;
    episode_number: number
    id: number,
    name: string;
    overview: string;
    season_number: number;
    still_path: string;
}

export interface IMovieDetail {
    id : number;
    backdrop_path : string;
    runtime : number;
    genres : IGenre[];
    overview : string;
    release_date : string;
    title : string;
    original_language : string;
    tagline : string;
    vote_average : number;
    vote_count : number;
    status : string;
}

export interface ITvDetail {
    id : number;
    genres : IGenre[];
    number_of_seasons : number;
    overview : string;
    backdrop_path : string;
    poster_path : string;
    original_language : string;
    name : string;
    first_air_date : string;
    seasons : ITvSeason[];
    status : string;
    tagline : string;
}

export interface IGetMoviesResult {
    dates :{
        maximum : string;
        minimum : string;
    },
    page : number;
    results : IMovie[];
    total_pages : number;
    total_results : number;
}

export interface IGetTrendingResult {
    page : number;
    results : ITrend[];
    total_pages : number;
    total_results : number;
}

export interface IGetPopularMoviesResult {
    page : number;
    results : IMovie[];
    total_pages : number;
    total_results : number;
}

export interface IGetPopularTvResult {
    page : number;
    results : ITv[];
    total_pages : number;
    total_results : number;
}

export interface IGetClipsResult {
    id : number;
    results : IClip[];
}

export interface IGetKeywords {
    id : number;
    results : IKeyword[];
}

export interface IGetCredits {
    id : number;
    cast : ICast[];
    crew : ICrew[];
}

export interface IGetSeason {
    _id: string;
    air_date: string;
    episodes: IEpisode[],
    overview: string;
    id: number;
    poster_path: string;
    season_number: number;
}

// NowPlaying
export function getNowPlayingMovies() {
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=us`).then(
        (res) => res.json()
    );
}

export function GetTrending() {
    return fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US&page=1&region=us`).then(
        (res) => res.json()
    );
}

export function GetPopularMovies() {
    return fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=2&region=us`).then(
        (res) => res.json()
    );
}

export function GetPopularTvSeries() {
    return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1&region=us`).then(
        (res) => res.json()
    );
}

export function GetMovieClips(id:number) {
    return fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US?append_to_response=videos`).then(
        (res) => res.json()
    );
}

export function GetTvClips(id:number) {
    return fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US?append_to_response=videos`).then(
        (res) => res.json()
    );
}

export function GetMovieDetail(id : number) {
    return fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
    );
}

export function GetTvDetail(id : number) {
    return fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
    );
}

export function GetMovieKeywords(id : number) {
    return fetch(`${BASE_URL}/movie/${id}/keywords?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
    );
}

export function GetMovieCredits(id : number) {
    return fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
    );
}

export function GetTvCredits(id : number) {
    return fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
    );
}

export function GetSimilarMovies(id : number) {
    return fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`).then(
        (res) => res.json()
    );
}

export function GetSimilarTv(id : number) {
    return fetch(`${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`).then(
        (res) => res.json()
    );
}

export function GetTvSesasonEpisodes(id : number, seasonNumber : number) {
    return fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US&page=1`).then(
        (res) => res.json()
    );
}

export function GetSearchResult(keyword : string, page : number) {
    return fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=${page}&include_adult=true`).then(
        (res) => res.json()
    );
}
