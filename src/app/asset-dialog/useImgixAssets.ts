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

export const useImgixAssets = ({
  apiKey,
  sourceId,
  resultsPerPage,
  pageNumber,
  query
}: {
  apiKey: string;
  sourceId: string;
  resultsPerPage: number;
  pageNumber: number;
  query?: string;
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

  const assets = useQuery({
    queryKey: ['assets', { skip, first, sourceId, query }],
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
