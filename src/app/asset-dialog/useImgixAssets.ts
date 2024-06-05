import { ImgixAsset } from '@/types';
import { useQuery } from '@tanstack/react-query';

type ImgixAssetsResponse = {
  data: ImgixAsset[];
  meta: {
    cursor: {
      current: string;
      hasMore: boolean;
      next: string;
      totalRecords: string;
    };
  };
};

const sorts = {
  size_ASC: '-file_size',
  size_DESC: 'file_size',
  createdAt_ASC: '-date_created',
  createdAt_DESC: 'date_created',
  updatedAt_ASC: '-date_modified',
  updatedAt_DESC: 'date_modified'
};

export type ImgixSort = keyof typeof sorts;

export const useImgixAssets = ({
  apiKey,
  sourceId,
  resultsPerPage,
  pageNumber,
  query,
  orderBy
}: {
  apiKey: string;
  sourceId: string;
  resultsPerPage: number;
  pageNumber: number;
  query?: string;
  orderBy?: ImgixSort;
}) => {
  const first = resultsPerPage;
  const skip = resultsPerPage * (pageNumber - 1);

  const params = new URLSearchParams({
    'page[limit]': String(first),
    'page[cursor]': String(skip)
  });

  if (query) {
    params.append('filter[or:categories]', query);
    params.append('filter[or:keywords]', query);
    params.append('filter[or:origin_path]', query);
  }

  if (orderBy) {
    params.append('sort', sorts[orderBy]);
  }

  const assets = useQuery({
    queryKey: ['assets', { skip, first, sourceId, query, orderBy }],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      const response = await fetch(`https://api.imgix.com/api/v1/sources/${sourceId}/assets?${params}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      const data = (await response.json()) as ImgixAssetsResponse;

      return {
        assets: data.data,
        hasNextPage: data.meta.cursor.hasMore,
        totalAssetCount: Number(data.meta.cursor.totalRecords)
      };
    }
  });

  return assets;
};
