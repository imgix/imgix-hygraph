'use client';

import { Button } from '@/components/button';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Asset, StoredAsset } from '@/types';
import { Nullable } from '@/types/common';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import { isEmpty } from 'lodash';
import findIndex from 'lodash/findIndex';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pick, uniqueBy } from 'remeda';
import { AssetCardList } from './components/asset-card-list';
import { ContentTableCell } from './components/content-table-cell';
import FieldRelationIcon from '/public/icons/field-relation.svg';

const ASSET_MANAGER_DIALOG_ROUTE = './asset-dialog';
const ASSETS_PREVIEW_DIALOG_ROUTE = './assets-preview-dialog';
const DIALOG_MAX_WIDTH = 'min(calc(100vw - 160px), 1280px)';

const AssetField = () => {
  const { t } = useTranslation();
  const config = useAppConfig();
  const {
    openDialog,
    onChange,
    value,
    field: { isList },
    isTableCell,
    isReadOnly
  } = useFieldExtension();

  const [assets, _setAssets] = useState(() => getInitialAssetsValue(value));

  const setAssets = (fn: (assets: StoredAsset[]) => StoredAsset[]) => {
    _setAssets((assets) => {
      const newAssets = fn(assets);
      const deduped = uniqueBy(newAssets, (asset) => asset.id);
      onChange(isList ? deduped : deduped[0]);
      return deduped;
    });
  };

  const updateAssets = (assets: StoredAsset[]) => {
    const transformAsset = (asset: StoredAsset) => pick(asset, ['url', 'id']);

    if (assets.length === 0) {
      return onChange(null);
    }

    setAssets(() => assets.map(transformAsset));
  };

  // Handles "Clear"/"Clear all" button
  useEffect(() => {
    if (value === null) setAssets(() => []);
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

      const newAssets: Asset[] = Array.isArray(newItems) ? newItems : [newItems];
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
      {!isReadOnly ? (
        <Button className="mt-2 w-full" variant="dashed" onClick={handleOpenAssetManagerDialog}>
          <div className="flex items-center space-x-1">
            <FieldRelationIcon className="h-4 w-4" />
            <span>
              {isList || assets.length === 0
                ? t('assetPicker.addAssetButtonLabel')
                : t('assetPicker.updateAssetButtonLabel')}
            </span>
          </div>
        </Button>
      ) : null}
    </>
  );
};

const getInitialAssetsValue = (value: Nullable<StoredAsset | StoredAsset[]>) => {
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
