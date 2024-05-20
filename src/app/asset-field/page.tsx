'use client';

import { DragEndEvent } from '@dnd-kit/core';
import findIndex from 'lodash/findIndex';
import { useEffect, useState } from 'react';

import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@hygraph/baukasten';
import { ComponentType } from 'react';

import { AssetCardList } from '@/app/asset-field/components/AssetCardList/AssetCardList';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Nullable } from '@/types/common';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import { FieldRelation } from '@hygraph/icons';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { ContentTableCell } from './components/ContentTableCell/ContentTableCell';
import { Asset } from '@/types';

const ASSET_MANAGER_DIALOG_ROUTE = './asset-dialog';
const ASSETS_PREVIEW_DIALOG_ROUTE = './assets-preview-dialog';
const DIALOG_MAX_WIDTH = 'calc(100vw - 160px)';

const AssetField = () => {
  const { t } = useTranslation();
  const config = useAppConfig();
  const {
    openDialog,
    onChange,
    value,
    field: { isList },
    isTableCell
  } = useFieldExtension();

  const [assets, setAssets] = useState(() => getInitialAssetsValue(value));

  const updateAssets = (assets: Asset[]) => {
    const assetToJsonField = (asset: Asset) => ({
      url: `${config.imgixBase}/${asset.handle}`,
      id: asset.id
    });

    if (assets.length === 0) {
      return onChange(null);
    }

    if (isList) {
      setAssets(assets);
      onChange(assets.map(assetToJsonField));
      return;
    }

    setAssets(assets);
    onChange(assetToJsonField(assets[0]));
  };

  // Handles "Clear"/"Clear all" button
  useEffect(() => {
    if (value === null) setAssets([]);
  }, [value]);

  const handleOpenPreviewDialog = () => {
    openDialog(ASSETS_PREVIEW_DIALOG_ROUTE, {
      disableOverlayClick: false,
      maxWidth: DIALOG_MAX_WIDTH,
      assets: assets
    });
  };

  const handleOpenAssetManagerDialog = () => {
    openDialog(ASSET_MANAGER_DIALOG_ROUTE, {
      isSingleSelect: !isList,
      disableOverlayClick: false,
      maxWidth: DIALOG_MAX_WIDTH,
      configuration: config,
      excludedAssets: assets.map((asset) => asset.id)
    }).then((newItems) => {
      if (!newItems) return;

      if (!isList) {
        updateAssets(newItems);
        return;
      }

      const newAssets = Array.isArray(newItems) ? newItems : [newItems];
      updateAssets([...assets, ...newAssets]);
    });
  };

  const handleOnRemoveItem = (id: string) => setAssets((assets) => assets.filter((asset) => asset.id !== id));

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !isList) return;

    setAssets((assets) => {
      const oldIndex = findIndex(assets, (asset) => asset.id === active.id);
      const newIndex = findIndex(assets, (asset) => asset.id === over.id);
      return arrayMove(assets, oldIndex, newIndex);
    });
  };

  if (isTableCell) {
    return <ContentTableCell assets={assets} handleOpenPreviewDialog={handleOpenPreviewDialog} />;
  }

  return (
    <>
      <AssetCardList
        assets={assets}
        handleOnRemoveItem={handleOnRemoveItem}
        handleOnDragEnd={handleOnDragEnd}
        isDraggingDisabled={!isList}
      />
      <Button
        className="mt-2 w-full"
        variant="dashed"
        variantColor="primary"
        size="large"
        iconBefore={FieldRelation as ComponentType}
        onClick={handleOpenAssetManagerDialog}
      >
        {isList || assets.length === 0 ? t('assetPicker.addAssetButtonLabel') : t('assetPicker.updateAssetButtonLabel')}
      </Button>
    </>
  );
};

const getInitialAssetsValue = (value: Nullable<Asset | Asset[]>) => {
  const fieldValue = isEmpty(value) ? null : value;

  if (Array.isArray(fieldValue)) {
    return fieldValue;
  }

  if (!fieldValue) {
    return [];
  }

  return [fieldValue];
};

export default AssetField;
