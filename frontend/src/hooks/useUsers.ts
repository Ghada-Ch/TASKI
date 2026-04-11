import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '../services/apollo';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await client.query<{ users: { id: string; name: string; email: string, role: string }[] }>({ query: GET_USERS });
      return data?.users ?? [];
    },
  });
};
