'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Asset } from '@/types';
import { hygraphAssetToAsset } from '@/util';
import { useState } from 'react';
import { isNullish } from 'remeda';
import { HygraphSort, useHygraphAssets } from '../useHygraphAssets';
import { AssetTable } from './asset-table';
import { DialogFooter, DialogHeader, useAssetDialog } from './dialog-commons';
import { Pagination } from './pagination';

export function HygraphAssetDialog() {
  const {
    closeDialogWithResult,
    isSingleSelect,
    context,
    excludedAssets,
    selectedAssets,
    addToSelection,
    onSelect,
    clearSelection,
    removeFromSelection,
    resultsPerPage,
    page,
    setResultsPerPage,
    setPage,
    configuration,
    query,
    setQuery,
    debouncedQuery
  } = useAssetDialog();

  const [showOnlySelectedAssets, setShowOnlySelectedAssets] = useState(false);
  const [selectedAssetsSnapshot, setSelectedAssetsSnapshot] = useState<Asset[]>([]);

  const [sortBy, setSortBy] = useState<HygraphSort | null>(null);

  const assetsQuery = useHygraphAssets({
    apiBase: context.environment.endpoint,
    authToken: context.environment.authToken,
    resultsPerPage: resultsPerPage,
    pageNumber: page,
    includedIds: showOnlySelectedAssets ? selectedAssetsSnapshot.map((asset) => asset.id) : undefined,
    excludedIds: excludedAssets.filter((id) => !isNullish(id)),
    query: debouncedQuery,
    orderBy: sortBy ?? undefined
  });

  const assets = assetsQuery?.data?.assets.map((asset) => hygraphAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || !assets;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(3,auto)_1fr_auto_auto]">
        <DialogHeader />

        <div className="border-b px-24 py-3">
          <Input
            className="max-w-[250px]"
            placeholder="Search for any item..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 border-b px-24 py-2 text-m">
          <p className="flex h-24 items-center">{selectedAssets.length} entries selected</p>

          {selectedAssets.length > 0 ? (
            <Button variant="secondary" size="small" onClick={clearSelection}>
              Clear selection
            </Button>
          ) : null}

          {selectedAssets.length > 0 || showOnlySelectedAssets ? (
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setSelectedAssetsSnapshot(selectedAssets);
                setPage(1);
                setShowOnlySelectedAssets(!showOnlySelectedAssets);
              }}
            >
              {showOnlySelectedAssets ? 'Show all entries' : 'Show selected entries'}
            </Button>
          ) : null}
        </div>

        <div className="overflow-auto">
          <AssetTable
            removeFromSelection={removeFromSelection}
            onSelect={onSelect}
            assets={assets ?? []}
            isLoading={isLoading}
            selectedAssets={selectedAssets}
            isSingleSelect={isSingleSelect}
            addToSelection={addToSelection}
            sortBy={sortBy}
            setSortBy={(sortBy) => {
              setSortBy(sortBy as HygraphSort | null);
            }}
            sortableColumns={[
              'id',
              'createdAt',
              'updatedAt',
              'handle',
              'fileName',
              'height',
              'width',
              'size',
              'mimeType'
            ]}
          />
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          totalItems={assetsQuery.data?.totalAssetCount ?? 0}
        />

        <DialogFooter
          isSingleSelect={isSingleSelect}
          closeDialog={() => closeDialogWithResult(selectedAssets)}
          selectedAssetCount={selectedAssets.length}
        />
      </div>
    </div>
  );
}
