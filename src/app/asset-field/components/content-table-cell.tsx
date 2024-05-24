import { StoredAsset } from '@/types';
import { Box, Spinner } from '@hygraph/baukasten';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { getResizedImgixUrl } from './asset-card';
import FieldAssetIcon from '/public/icons/field-asset.svg';
import Error404Icon from '/public/icons/error-404.svg';

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
    return <Error404Icon className="h-[40px] w-[40px] text-neutral-200" />;
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

  return <FieldAssetIcon className="h-[40px] w-[40px] text-neutral-200" />;
};
