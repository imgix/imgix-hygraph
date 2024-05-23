'use client';

import { Button } from '@/components/button';
import { Spinner } from '@/components/spinner';
import { type AppConfig } from '@/hooks/useAppConfig';
import { Asset } from '@/types';
import { hygraphAssetToAsset, imgixAssetToAsset } from '@/util';
import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { useState } from 'react';
import { uniqueBy } from 'remeda';
import { AssetTable } from './components/asset-table';
import { Pagination } from './components/pagination';
import { useHygraphAssets } from './useHygraphAssets';
import { useImgixAssets } from './useImgixAssets';
import FieldAssetIcon from '/public/icons/field-asset.svg';
import { Input } from '@/components/input';

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

function HygraphAssetDialog() {
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
    configuration
  } = useAssetDialog();

  const [query, setQuery] = useState('');
  const [showOnlySelectedAssets, setShowOnlySelectedAssets] = useState(false);
  const [selectedAssetsSnapshot, setSelectedAssetsSnapshot] = useState<Asset[]>([]);

  const assetsQuery = useHygraphAssets({
    apiBase: context.environment.endpoint,
    authToken: context.environment.authToken,
    resultsPerPage: resultsPerPage,
    pageNumber: page,
    includedIds: showOnlySelectedAssets ? selectedAssetsSnapshot.map((asset) => asset.id) : undefined,
    excludedIds: excludedAssets,
    query: query
  });

  const assets = assetsQuery?.data?.assets.map((asset) => hygraphAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || !assets;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(3,auto)_1fr_auto_auto]">
        <DialogHeader />

        <div className="px-24 py-8">
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
          {isLoading ? (
            <Loading />
          ) : (
            <AssetTable
              removeFromSelection={removeFromSelection}
              onSelect={onSelect}
              assets={assets}
              selectedAssets={selectedAssets}
              isSingleSelect={isSingleSelect}
              addToSelection={addToSelection}
            />
          )}
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

function ImgixAssetDialog() {
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
    setPage
  } = useAssetDialog();

  const [query, setQuery] = useState('');

  const assetsQuery = useImgixAssets({
    apiKey: configuration.imgixToken,
    pageNumber: page,
    resultsPerPage: resultsPerPage,
    sourceId: configuration.imgixSourceId,
    query: query
  });

  const assets = assetsQuery?.data?.assets.map((asset) => imgixAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || !assets;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(3,auto)_1fr_auto_auto]">
        <DialogHeader />

        <div className="flex px-24 py-8">
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
          {isLoading ? (
            <Loading />
          ) : (
            <AssetTable
              removeFromSelection={removeFromSelection}
              onSelect={onSelect}
              assets={assets}
              selectedAssets={selectedAssets}
              isSingleSelect={isSingleSelect}
              addToSelection={addToSelection}
            />
          )}
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

function DialogHeader() {
  return (
    <div className="flex items-center space-x-12 border-b p-24">
      <FieldAssetIcon className="h-32 w-32 rounded bg-brand-100 p-2 text-brand-500" />
      <h4 className="text-lg font-medium">Select Asset</h4>
    </div>
  );
}

function DialogFooter({
  closeDialog,
  selectedAssetCount,
  isSingleSelect
}: {
  closeDialog: () => void;
  selectedAssetCount: number;
  isSingleSelect: boolean;
}) {
  const showAssetCount = selectedAssetCount > 1;
  const allowSubmit = selectedAssetCount > 0;

  return !isSingleSelect ? (
    <div className="flex justify-end rounded-b-lg bg-brand-50 px-24 py-16">
      <Button onClick={closeDialog} disabled={!allowSubmit}>
        Add selected assets {showAssetCount ? `(${selectedAssetCount})` : ''}
      </Button>
    </div>
  ) : null;
}

function Loading() {
  return (
    <div className="grid h-full w-full place-items-center text-brand-500">
      <Spinner />
    </div>
  );
}

const useAssetDialog = () => {
  const { onCloseDialog, isSingleSelect, ...rest } = useUiExtensionDialog<
    Asset[],
    {
      isSingleSelect: boolean;
      excludedAssets: string[];
      context: { environment: { authToken: string; endpoint: string } };
      configuration: AppConfig;
    }
  >();

  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const addToSelection = (addedAssets: Asset[]) => {
    setSelectedAssets((assets) => uniqueBy([...assets, ...addedAssets], (asset) => asset.id));
  };

  const removeFromSelection = (removedAssets: Asset[]) => {
    setSelectedAssets((assets) =>
      assets.filter((selectedAsset) => !removedAssets.some((removedAsset) => removedAsset.id === selectedAsset.id))
    );
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  const onSelect = (asset: Asset) => {
    if (isSingleSelect) {
      return onCloseDialog([asset]);
    }

    addToSelection([asset]);
  };

  return {
    selectedAssets,
    addToSelection,
    removeFromSelection,
    clearSelection,
    onSelect,
    setResultsPerPage,
    setPage,
    resultsPerPage,
    page,
    closeDialogWithResult: onCloseDialog,
    isSingleSelect: isSingleSelect,
    ...rest
  };
};
