import { HygraphAsset } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

type Data = {
  assetsConnection: {
    edges: {
      node: HygraphAsset;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    aggregate: {
      count: number;
    };
  };
};

const document = gql`
  query Assets($first: Int!, $skip: Int!, $where: AssetWhereInput!) {
    assetsConnection(first: $first, skip: $skip, where: $where) {
      edges {
        node {
          createdAt
          fileName
          handle
          height
          id
          size
          stage
          updatedAt
          width
          mimeType
          url
          createdBy {
            picture
            name
          }
          updatedBy {
            picture
            name
          }
        }
      }
      aggregate {
        count
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const useHygraphAssets = ({
  apiBase,
  authToken,
  resultsPerPage,
  pageNumber,
  includedIds,
  excludedIds,
  query
}: {
  apiBase: string;
  authToken: string;
  resultsPerPage: number;
  pageNumber: number;
  includedIds?: string[];
  excludedIds: string[];
  query?: string;
}) => {
  const first = resultsPerPage;
  const skip = resultsPerPage * (pageNumber - 1);

  const assets = useQuery({
    queryKey: ['assets', { skip, first, excludedIds, includedIds, query }],
    queryFn: async () => {
      const data = await request<Data>({
        url: apiBase,
        document: document,
        variables: {
          first,
          skip,
          where: {
            id_not_in: excludedIds,
            id_in: includedIds,
            _search: query
          }
        },
        requestHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const assets = data.assetsConnection.edges.map((edge) => edge.node);
      return {
        assets: assets,
        hasNextPage: data.assetsConnection.pageInfo.hasNextPage,
        hasPreviousPage: data.assetsConnection.pageInfo.hasPreviousPage,
        totalAssetCount: data.assetsConnection.aggregate.count
      };
    }
  });

  return assets;
};
