import { StoredAsset } from '@/types';
import { Box, Spinner } from '@hygraph/baukasten';
import { Error404, FieldAsset, MoreFill } from '@hygraph/icons';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { getResizedImgixUrl } from './asset-card';

type ContentTableCellProps = {
  handleOpenPreviewDialog: () => void;
  assets: StoredAsset[];
};

export const ContentTableCell = ({ handleOpenPreviewDialog, assets }: ContentTableCellProps) => {
  return (
    <div className="flex max-h-[60px] cursor-pointer gap-2" onClick={handleOpenPreviewDialog}>
      {assets.slice(0, 3).map((asset) => (
        <div className="relative flex h-[60px] w-[60px] items-center justify-center" key={asset.id}>
          <ContentTableCellThumbnail {...asset} />
        </div>
      ))}
      {assets.length > 3 && (
        <div className="flex h-[60px] w-[60px] items-center justify-center">
          <Box as={MoreFill} color="neutral.200" width={40} height={40} />
        </div>
      )}
    </div>
  );
};

const ContentTableCellThumbnail = (asset: StoredAsset) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    const image = new Image();
    image.src = asset.url;
    image.onload = () => setStatus('success');
    image.onerror = () => setStatus('error');
  }, [asset.url]);

  if (status === 'loading') {
    return <Spinner size="spinner.xs" />;
  }

  if (status === 'error') {
    return <Box as={Error404} color="neutral.200" width={40} height={40} />;
  }

  if (status === 'success') {
    return (
      <img
        src={getResizedImgixUrl(asset.url)}
        alt={t('general.assetThumbnailAlt')}
        className="h-[60px] w-[60px] object-cover object-center"
      />
    );
  }

  return <Box as={FieldAsset} color="neutral.200" width={40} height={40} />;
};
