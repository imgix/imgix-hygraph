'use client';

import { type AppConfig } from '@/hooks/useAppConfig';
import { Asset } from '@/types';
import { hygraphAssetToAsset, imgixAssetToAsset } from '@/util';
import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { Box, Button, Divider, Heading, Progress } from '@hygraph/baukasten';
import { useState } from 'react';
import { uniqueBy } from 'remeda';
import { AssetTable } from './components/asset-table';
import { Pagination } from './components/pagination';
import { useHygraphAssets } from './useHygraphAssets';
import { useImgixAssets } from './useImgixAssets';
import AttachmentIcon from '/public/icons/attachment.svg';

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

  const [showOnlySelectedAssets, setShowOnlySelectedAssets] = useState(false);
  const [selectedAssetsSnapshot, setSelectedAssetsSnapshot] = useState<Asset[]>([]);

  const assetsQuery = useHygraphAssets({
    apiBase: context.environment.endpoint,
    authToken: context.environment.authToken,
    resultsPerPage: resultsPerPage,
    pageNumber: page,
    includedIds: showOnlySelectedAssets ? selectedAssetsSnapshot.map((asset) => asset.id) : undefined,
    excludedIds: excludedAssets
  });

  const assets = assetsQuery?.data?.assets.map((asset) => hygraphAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || !assets;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(4,auto)_1fr_repeat(2,auto)]">
        <DialogHeader />

        <Divider margin="0" />

        <Box px="24px" py="8px" className="flex space-x-2 text-m">
          <p className="flex h-24 items-center">{selectedAssets.length} entries selected</p>

          {selectedAssets.length > 0 ? (
            <Button variant="ghost" variantColor="secondary" size="small" onClick={clearSelection}>
              Clear selection
            </Button>
          ) : null}

          {selectedAssets.length > 0 || showOnlySelectedAssets ? (
            <Button
              variant="ghost"
              variantColor="secondary"
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
        </Box>

        <Divider margin="0" />

        <div className="overflow-auto">
          {isLoading ? (
            <Progress variant="slim" margin={0} />
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

  const assetsQuery = useImgixAssets({
    apiKey: configuration.imgixToken,
    pageNumber: page,
    resultsPerPage: resultsPerPage,
    sourceId: configuration.imgixSourceId
  });

  const assets = assetsQuery?.data?.assets.map((asset) => imgixAssetToAsset(asset, configuration.imgixBase));
  const isLoading = assetsQuery.isLoading || !assets;

  return (
    <div className="h-[48rem]">
      <div className="grid h-full grid-rows-[repeat(4,auto)_1fr_repeat(2,auto)]">
        <DialogHeader />

        <Divider margin="0" />

        <Box px="24px" py="8px" className="flex space-x-2 text-m">
          <p className="flex h-24 items-center">{selectedAssets.length} entries selected</p>

          {selectedAssets.length > 0 ? (
            <Button variant="ghost" variantColor="secondary" size="small" onClick={clearSelection}>
              Clear selection
            </Button>
          ) : null}
        </Box>

        <Divider margin="0" />

        <div className="overflow-auto">
          {isLoading ? (
            <Progress variant="slim" margin={0} />
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
    <div className="flex items-center space-x-12 p-24">
      <AttachmentIcon className="h-32 w-32 rounded bg-brand-100 p-2 text-brand-500" />
      <Heading as="h4" className="text-lg font-medium">
        Select Asset
      </Heading>
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
      <Button onClick={closeDialog} size="large" disabled={!allowSubmit}>
        Add selected assets {showAssetCount ? `(${selectedAssetCount})` : ''}
      </Button>
    </div>
  ) : null;
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
