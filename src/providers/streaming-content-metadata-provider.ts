export abstract class StreamingContentMetadataProvider {
  abstract getStreamingContentMetadata(
    text: string,
  ): Promise<StreamingContentMetadata[]>;
}

export interface StreamingContentMetadata {
  coverImage: string;
  title: string;
  description: string;
  releaseDate: string;
  genreIds: number[];
  rating: number;
  mediaType: string;
}
/*
i have genre ids, but not their name. need to convert them into their name. i should do this with a funciton 
and it should be in the tmdb api file since this would be spefici to it. 


*/