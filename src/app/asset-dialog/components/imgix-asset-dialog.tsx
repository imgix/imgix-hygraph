'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { imgixAssetToAsset } from '@/util';
import { useState } from 'react';
import { ImgixSort, useImgixAssets } from '../useImgixAssets';
import { AssetTable } from './asset-table';
import { DialogFooter, DialogHeader, useAssetDialog } from './dialog-commons';
import { Pagination } from './pagination';

export function ImgixAssetDialog() {
  const {
    closeDialogWithResult,
    isSingleSelect,
    configuration,
    selectedAssets,
    addToSelection,
    onSelect,
    clearSelection,
    removeFromSelection,
    page,
    resultsPerPage,
    setResultsPerPage,
    setPage,
    query,
    setQuery,
    debouncedQuery
  } = useAssetDialog();

  const [sortBy, setSortBy] = useState<ImgixSort | null>(null);

  const assetsQuery = useImgixAssets({
    apiKey: configuration.imgixToken,
    pageNumber: page,
    resultsPerPage: resultsPerPage,
    sourceId: configuration.imgixSourceId,
    query: debouncedQuery,
    orderBy: sortBy ?? undefined
  });

  const assets = assetsQuery?.data?.assets.map((asset) => imgixAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || assetsQuery.isPlaceholderData;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(3,auto)_1fr_auto_auto]">
        <DialogHeader />

        <div className="flex border-b px-24 py-8">
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
        </div>

        <div className="overflow-auto">
          <AssetTable
            removeFromSelection={removeFromSelection}
            onSelect={onSelect}
            assets={assets ?? []}
            selectedAssets={selectedAssets}
            isSingleSelect={isSingleSelect}
            addToSelection={addToSelection}
            sortBy={sortBy}
            isLoading={isLoading}
            setSortBy={(sortBy) => {
              setSortBy(sortBy as ImgixSort | null);
            }}
            sortableColumns={['size', 'createdAt', 'updatedAt']}
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
