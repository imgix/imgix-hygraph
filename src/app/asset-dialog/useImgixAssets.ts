import { useQuery } from '@tanstack/react-query';

export type ImgixAsset = {
  id: string;
  attributes: {
    content_type: string;
    date_created: number;
    date_modified: number;
    uploaded_by: string;
    description: string;
    dpi_height: number;
    dpi_width: number;
    face_count: number;
    file_size: number;
    media_kind: string;
    media_height: number;
    media_width: number;
    name: string;
    origin_path: string;
  };
};

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
  pageNumber
}: {
  apiKey: string;
  sourceId: string;
  resultsPerPage: number;
  pageNumber: number;
}) => {
  const first = resultsPerPage;
  const skip = resultsPerPage * (pageNumber - 1);

  const params = new URLSearchParams({
    'page[limit]': String(first),
    'page[cursor]': String(skip)
  });

  const assets = useQuery({
    queryKey: ['assets', { skip, first, sourceId }],
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
