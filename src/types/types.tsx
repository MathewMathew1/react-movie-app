export type moviePreviewType = {
    id: number;
    releaseDate: string;
    fullTitle: string;
    rating: number;
    overview: string;
    image: string;
    ratingCount: number;
    media_type?: string;
  }

export type UserInfo = {
  id: number;
  name: string;
  username: string;
  avatar: {
    gravatar: {
      hash: string
    }
    tmdb: {
      avatar_path: null
    }
  };
}  

export type tvShowPreviewType = {
  id: number;
  firstAirDate: string;
  name: string;
  rating: number;
  overview: string;
  image: string;
  ratingCount: number;
}  

export type actorType = {
  id: string;
  image: string;
  name: string;
}

export type actorInfoType = {
  alsoKnownAs: string[];
  biography: string;
  birthDay: string;
  deathday: string|null;
  homepage: string;
  id: number;
  department: string;
  name: string;
  placeOfBirth: string;
  image: string;
  castPerformance: moviePreviewType[];
  crewPerformance: moviePreviewType[];
}

export type actorPerformance = {
  castPerformance: moviePreviewType[];
  crewPerformance: moviePreviewType[]; 
}

type genreType = {
  id: string;
  name: string;
}

export type useFetchSettingType = {
  url: string;
  options: object;
  dependencies: [];
  saveToSession: boolean;
  sessionStorageName: string|undefined;
}

export type userReviewInfo = {
  avatar_image: string;
  rating: number|null;
  username: string;
}

export type movieReview = {
  author: string;
  content: string;
  id: string;
  createdDate: string;
  updatedDate: string;
  authorDetails: userReviewInfo
}

type productionCompanies = {
  id: string;
  logo_path: string;
  name: string;
  origin_country: string;
}

export type episode = {
  id: string;
  air_date: string;
  episodeNumber: number;
  name: string;
  overview: string;
  image: string;
  voteAverage: number;
  voteCount: number;
}

export type movieFullType = moviePreviewType & {
    actorList: actorType[];
    genres: genreType[];
    tagline: string;
    companies: productionCompanies[];
    directors: string[];
    reviews: movieReview[];
    status: string;
    homepage: string;
    originalLanguage: string;
}

export type tvShowType = tvShowPreviewType & {
  actorList: actorType[];
  genres: genreType[];
  lastEpisodeToAir: episode;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  reviews: movieReview[];
  tagline: string;
  status: string;
  inProduction: true;
  networks: productionCompanies[];
  homepage: string;
  originalLanguage: string;
}

export enum severityColors {
  error = "rgb(240, 56, 19)",
  warning = "rgb(247, 247, 10)",
  success = "rgb(18, 230, 113)",
}

type InfoAboutSeance = {
  adult: boolean,
  backdrop_path: string,
  genre_ids: number[],
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,  
  poster_path: string,
  vote_average: number,
  vote_count: number,
}

export type MovieInfoBackend = InfoAboutSeance & {
  original_title: string, 
  release_date: string,
  title: string,
  video: boolean,
}

export type TvShowInfoBackend = InfoAboutSeance & {
  first_air_date: string,
  name: string,
  origin_country: string[],
  original_name: string,
}