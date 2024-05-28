import { Button } from '@/components/button';
import { Nullable, StoredAsset } from '@/types';
import { useTranslation } from 'react-i18next';
import ArrowLeftIcon from '/public/icons/arrow-left.svg';
import CloseIcon from '/public/icons/close.svg';

type SingleAssetPreview = {
  singleAssetPreview: StoredAsset;
  onCloseDialog: (assets: Nullable<StoredAsset[]>) => void;
  isFromSingleAssetField: boolean;
  setSingleAssetPreview: (asset: Nullable<StoredAsset>) => void;
};

const SingleAssetPreview = ({
  singleAssetPreview,
  onCloseDialog,
  isFromSingleAssetField,
  setSingleAssetPreview
}: SingleAssetPreview) => {
  const { t } = useTranslation();
  const { url } = singleAssetPreview;

  return (
    <div className="flex h-[900px] justify-center p-48">
      {isFromSingleAssetField ? (
        <Button
          variant="ghostSecondary"
          className="absolute right-0 top-0 m-8"
          size="icon"
          onClick={() => onCloseDialog(null)}
        >
          <CloseIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghostSecondary"
          size="icon"
          className="absolute right-0 top-0 m-8"
          onClick={() => setSingleAssetPreview(null)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
      )}

      <div>
        <img
          alt={t('general.assetThumbnailAlt')}
          src={url}
          className="h-full w-full object-scale-down text-transparent"
        />
      </div>
    </div>
  );
};

export { SingleAssetPreview };
