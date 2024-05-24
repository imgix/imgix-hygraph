import { Button } from '@/components/button';
import { StoredAsset } from '@/types';
import { Nullable } from '@/types/common';
import { Box, DialogContent, Grid } from '@hygraph/baukasten';
import { useTranslation } from 'react-i18next';
import FieldAssetIcon from '/public/icons/field-asset.svg';
import CloseIcon from '/public/icons/close.svg';

interface MultipleAssetsPreview {
  assets: StoredAsset[];
  onCloseDialog: (assets: Nullable<StoredAsset[]>) => void;
  handleClick: (asset: StoredAsset) => void;
}

const MultipleAssetsPreview = ({ assets, onCloseDialog, handleClick }: MultipleAssetsPreview) => {
  return (
    <DialogContent height={900} padding={48}>
      <Button
        variant="ghostSecondary"
        className="absolute right-0 top-0 m-8"
        size="icon"
        onClick={() => onCloseDialog(null)}
      >
        <CloseIcon className="h-4 w-4" />
      </Button>
      <Grid gridTemplateColumns="repeat(4, 1fr)" gap="8">
        {assets.map((asset, index) => (
          <Box
            key={index}
            onClick={() => handleClick(asset)}
            height={200}
            cursor="pointer"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MultipleAssetsPreviewThumbnail {...asset} />
          </Box>
        ))}
      </Grid>
    </DialogContent>
  );
};

const MultipleAssetsPreviewThumbnail = (asset: StoredAsset) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      {asset.url ? (
        <img src={asset.url} alt={t('general.assetThumbnailAlt')} className="object-fit h-full" />
      ) : (
        <FieldAssetIcon className="h-[60px] w-[60px] text-neutral-200" />
      )}
    </div>
  );
};

export { MultipleAssetsPreview };
