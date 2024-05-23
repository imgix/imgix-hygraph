import { StoredAsset } from '@/types';
import { Box, Flex, Spinner } from '@hygraph/baukasten';
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
    <Flex flexDirection="row" maxHeight="60px" gap={8} cursor="pointer" onClick={handleOpenPreviewDialog}>
      {assets.slice(0, 3).map((asset) => (
        <Box
          height={60}
          width={60}
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          key={asset.id}
        >
          <ContentTableCellThumbnail {...asset} />
        </Box>
      ))}
      {assets.length > 3 && (
        <Box height={60} width={60} display="flex" justifyContent="center" alignItems="center">
          <Box as={MoreFill} color="neutral.200" width={40} height={40} />
        </Box>
      )}
    </Flex>
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
