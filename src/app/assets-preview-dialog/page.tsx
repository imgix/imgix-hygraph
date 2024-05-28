'use client';

import { useEffect, useState } from 'react';
import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { Nullable, StoredAsset } from '@/types';
import { SingleAssetPreview } from './components/single-asset-preview';
import { MultipleAssetsPreview } from './components/multiple-assets-preview';

const AssetsPreviewDialog = () => {
  const [singleAssetPreview, setSingleAssetPreview] = useState<Nullable<StoredAsset>>(null);
  const { assets, onCloseDialog } = useUiExtensionDialog<
    unknown,
    { assets: StoredAsset[]; onCloseDialog: (assets: StoredAsset[]) => void }
  >();

  const isFromSingleAssetField = assets.length === 1;

  useEffect(() => {
    // If there is only one item, show its preview immediately
    if (isFromSingleAssetField) {
      setSingleAssetPreview(assets[0]);
    }
  }, [assets, isFromSingleAssetField]);

  if (singleAssetPreview) {
    return (
      <SingleAssetPreview
        singleAssetPreview={singleAssetPreview}
        onCloseDialog={onCloseDialog}
        isFromSingleAssetField={isFromSingleAssetField}
        setSingleAssetPreview={setSingleAssetPreview}
      />
    );
  }

  return (
    <MultipleAssetsPreview
      assets={assets}
      onCloseDialog={onCloseDialog}
      handleClick={(asset) => setSingleAssetPreview(asset)}
    />
  );
};

export default AssetsPreviewDialog;
