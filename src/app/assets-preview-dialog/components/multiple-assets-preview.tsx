import { Button } from '@/components/button';
import { StoredAsset } from '@/types';
import { Nullable } from '@/types/common';
import { Box, DialogContent, Flex, Grid } from '@hygraph/baukasten';
import { Close, FieldAsset } from '@hygraph/icons';
import { useTranslation } from 'react-i18next';

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
        <Box as={Close} className="h-4 w-4" />
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
    <Flex justifyContent="center" alignItems="center" flexDirection="column" width="100%" height="100%" gap={4}>
      {asset.url ? (
        <img src={asset.url} alt={t('general.assetThumbnailAlt')} className="object-fit h-full" />
      ) : (
        <Box as={FieldAsset} color="neutral.200" width={60} height={60} />
      )}
    </Flex>
  );
};

export { MultipleAssetsPreview };
