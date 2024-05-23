import { Box, DialogContent, Flex, Grid, IconButton, Pill, Stack } from '@hygraph/baukasten';
import { Close, FieldAsset } from '@hygraph/icons';
import { Icon, Nullable } from '@/types/common';
import { useTranslation } from 'react-i18next';
import { StoredAsset } from '@/types';

interface MultipleAssetsPreview {
  assets: StoredAsset[];
  onCloseDialog: (assets: Nullable<StoredAsset[]>) => void;
  handleClick: (asset: StoredAsset) => void;
}

const MultipleAssetsPreview = ({ assets, onCloseDialog, handleClick }: MultipleAssetsPreview) => {
  return (
    <DialogContent height={900} padding={48}>
      <IconButton
        icon={Close as Icon}
        variant="outline"
        variantColor="primary"
        position="absolute"
        right={0}
        top={0}
        margin={8}
        onClick={() => onCloseDialog(null)}
      />
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
