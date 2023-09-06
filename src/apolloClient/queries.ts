import { gql } from '@apollo/client';
export const COMPANY_QUERY = gql`
  {
    company {
      ceo
      cto
      name
    }
  }
`;
