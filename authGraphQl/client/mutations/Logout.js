import { gql } from "@apollo/client";

export default gql`
  mutation Logout {
    logout {
      id
      email
    }
  }
`;
