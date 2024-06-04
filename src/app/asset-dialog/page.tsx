'use client';

import { type AppConfig } from '@/hooks/useAppConfig';
import { Asset } from '@/types';
import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { HygraphAssetDialog } from './components/hygraph-asset-dialog';
import { ImgixAssetDialog } from './components/imgix-asset-dialog';

export default function AssetDialog() {
  const { configuration } = useUiExtensionDialog<
    Asset[],
    {
      configuration: AppConfig;
    }
  >();

  if (configuration.imgixSourceType === 'hygraph-webfolder') {
    return <HygraphAssetDialog />;
  }

  if (configuration.imgixSourceType === 'other') {
    return <ImgixAssetDialog />;
  }
}
