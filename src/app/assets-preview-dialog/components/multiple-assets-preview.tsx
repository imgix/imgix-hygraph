import { Button } from '@/components/button';
import { Nullable, StoredAsset } from '@/types';
import { useTranslation } from 'react-i18next';
import CloseIcon from '/public/icons/close.svg';
import FieldAssetIcon from '/public/icons/field-asset.svg';

type MultipleAssetsPreview = {
  assets: StoredAsset[];
  onCloseDialog: (assets: Nullable<StoredAsset[]>) => void;
  handleClick: (asset: StoredAsset) => void;
};

const MultipleAssetsPreview = ({ assets, onCloseDialog, handleClick }: MultipleAssetsPreview) => {
  return (
    <div className="h-[900px] p-48">
      <Button
        variant="ghostSecondary"
        className="absolute right-0 top-0 m-8"
        size="icon"
        onClick={() => onCloseDialog(null)}
      >
        <CloseIcon className="h-4 w-4" />
      </Button>
      <div className="grid grid-cols-[repeat(4,1fr)] gap-8">
        {assets.map((asset, index) => (
          <div
            className="flex h-[200px] cursor-pointer items-center justify-center"
            key={index}
            onClick={() => handleClick(asset)}
          >
            <MultipleAssetsPreviewThumbnail {...asset} />
          </div>
        ))}
      </div>
    </div>
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
