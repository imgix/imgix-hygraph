import { Button } from '@/components/button';
import { StoredAsset } from '@/types';
import { Nullable } from '@/types/common';
import { Box, DialogContent } from '@hygraph/baukasten';
import { ArrowBack, Close } from '@hygraph/icons';
import { useTranslation } from 'react-i18next';

interface SingleAssetPreview {
  singleAssetPreview: StoredAsset;
  onCloseDialog: (assets: Nullable<StoredAsset[]>) => void;
  isFromSingleAssetField: boolean;
  setSingleAssetPreview: (asset: Nullable<StoredAsset>) => void;
}

const SingleAssetPreview = ({
  singleAssetPreview,
  onCloseDialog,
  isFromSingleAssetField,
  setSingleAssetPreview
}: SingleAssetPreview) => {
  const { t } = useTranslation();
  const { url } = singleAssetPreview;

  return (
    <DialogContent padding={48} height={900} display="flex" justifyContent="center">
      <Button
        variant="ghostSecondary"
        className="absolute right-0 top-0 m-8"
        size="icon"
        onClick={() => onCloseDialog(null)}
      >
        <Box as={Close} className="h-4 w-4" />
      </Button>
      {!isFromSingleAssetField && (
        <Button
          variant="ghostSecondary"
          size="icon"
          className="absolute right-0 top-0 m-8"
          onClick={() => setSingleAssetPreview(null)}
        >
          <Box as={ArrowBack} className="h-4 w-4" />
        </Button>
      )}
      <Box>
        <img
          alt={t('general.assetThumbnailAlt')}
          src={url}
          className="h-full w-full object-scale-down text-transparent"
        />
      </Box>
    </DialogContent>
  );
};

export { SingleAssetPreview };
