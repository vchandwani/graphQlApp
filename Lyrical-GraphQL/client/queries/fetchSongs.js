import { gql } from "@apollo/client";

export const FETCH_SONGS_QUERY = gql`
  {
    songs {
      id
      title
    }
  }
`;
