'use client';

import { Button } from '@/components/button';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Asset, Nullable, StoredAsset } from '@/types';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import findIndex from 'lodash/findIndex';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isArray, isDeepEqual, isNullish, pick, uniqueBy } from 'remeda';
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
    value: _value,
    field: { isList },
    isTableCell,
    isReadOnly
  } = useFieldExtension();

  const value = _value as Nullable<StoredAsset | StoredAsset[] | ''>;

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

  useEffect(() => {
    // Handles "Clear"/"Clear all" button
    if (isNullish(value) || value === '') {
      setAssets(() => []);
      return;
    }

    // Handles "Restore published value" feature
    if (isList && isArray(value) && !isDeepEqual(value, assets)) {
      _setAssets(value);
    }

    if (!isList && !isArray(value) && value.id !== assets[0]?.id) {
      _setAssets([value]);
    }
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

  const getLabel = () => {
    if (isList) {
      return t('assetPicker.addAssetsButtonLabel');
    }

    if (assets.length === 0) {
      return t('assetPicker.addAssetButtonLabel');
    }

    return t('assetPicker.updateAssetButtonLabel');
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
        isReadOnly={isReadOnly ?? false}
      />
      {!isReadOnly ? (
        <Button className="mt-2 w-full" variant="dashed" onClick={handleOpenAssetManagerDialog}>
          <div className="flex items-center space-x-1">
            <FieldRelationIcon className="h-4 w-4" />
            <span>{getLabel()}</span>
          </div>
        </Button>
      ) : null}
    </>
  );
};

const getInitialAssetsValue = (value: Nullable<StoredAsset | StoredAsset[] | ''>) => {
  const fieldValue = isNullish(value) || value === '' ? null : value;

  if (isArray(fieldValue)) {
    return fieldValue;
  }

  if (!fieldValue) {
    return [];
  }

  return [fieldValue];
};

export default AssetField;
