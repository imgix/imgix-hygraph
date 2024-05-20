'use client';

import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { Box, Button, Divider, Heading, Progress } from '@hygraph/baukasten';
import { useState } from 'react';
import { uniqueBy } from 'remeda';
import { AssetTable } from './components/asset-table';
import { Pagination } from './components/pagination';
import { HygraphAsset, useHygraphAssets } from './useHygraphAssets';
import AttachmentIcon from '/public/icons/attachment.svg';
import { useImgixAssets } from './useImgixAssets';
import { type AppConfig } from '@/hooks/useAppConfig';

export default function AssetDialog() {
  const { configuration } = useUiExtensionDialog<
    HygraphAsset[],
    {
      configuration: AppConfig;
    }
  >();

  if (configuration.imgixSourceType === 'webfolder') {
    return <HygraphAssetDialog />;
  }

  if (configuration.imgixSourceType === 'other') {
    return <ImgixAssetDialog />;
  }
}

function HygraphAssetDialog() {
  const {
    onCloseDialog: closeDialogWithResult,
    isSingleSelect,
    context,
    excludedAssets
  } = useUiExtensionDialog<
    HygraphAsset[],
    {
      isSingleSelect: boolean;
      excludedAssets: string[];
      context: { environment: { authToken: string; endpoint: string } };
    }
  >();

  const [selectedAssets, setSelectedAssets] = useState<HygraphAsset[]>([]);
  const [showOnlySelectedAssets, setShowOnlySelectedAssets] = useState(false);
  const [selectedAssetsSnapshot, setSelectedAssetsSnapshot] = useState<HygraphAsset[]>([]);

  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const assetsQuery = useHygraphAssets({
    apiBase: context.environment.endpoint,
    authToken: context.environment.authToken,
    resultsPerPage: resultsPerPage,
    pageNumber: page,
    includedIds: showOnlySelectedAssets ? selectedAssetsSnapshot.map((asset) => asset.id) : undefined,
    excludedIds: excludedAssets
  });

  const addToSelection = (addedAssets: HygraphAsset[]) => {
    setSelectedAssets((assets) => uniqueBy([...assets, ...addedAssets], (asset) => asset.id));
  };

  const removeFromSelection = (removedAssets: HygraphAsset[]) => {
    setSelectedAssets((assets) =>
      assets.filter((selectedAsset) => !removedAssets.some((removedAsset) => removedAsset.id === selectedAsset.id))
    );
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  const onSelect = (asset: HygraphAsset) => {
    if (isSingleSelect) {
      return closeDialogWithResult([asset]);
    }

    addToSelection([asset]);
  };

  const isLoading = assetsQuery.isLoading || !assetsQuery.data;

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
              assets={assetsQuery.data.assets}
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

        {!isSingleSelect ? (
          <DialogFooter
            closeDialog={() => closeDialogWithResult(selectedAssets)}
            selectedAssetCount={selectedAssets.length}
          />
        ) : null}
      </div>
    </div>
  );
}

function ImgixAssetDialog() {
  const {
    onCloseDialog: closeDialogWithResult,
    isSingleSelect,
    configuration
  } = useUiExtensionDialog<
    HygraphAsset[],
    {
      isSingleSelect: boolean;
      excludedAssets: string[];
      configuration: AppConfig;
    }
  >();

  const [selectedAssets, setSelectedAssets] = useState<HygraphAsset[]>([]);
  const [showOnlySelectedAssets, setShowOnlySelectedAssets] = useState(false);
  const [selectedAssetsSnapshot, setSelectedAssetsSnapshot] = useState<HygraphAsset[]>([]);

  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const assetsQuery = useImgixAssets({
    apiKey: configuration.imgixToken,
    pageNumber: page,
    resultsPerPage: resultsPerPage,
    sourceId: configuration.imgixSourceId
  });

  const addToSelection = (addedAssets: HygraphAsset[]) => {
    setSelectedAssets((assets) => uniqueBy([...assets, ...addedAssets], (asset) => asset.id));
  };

  const removeFromSelection = (removedAssets: HygraphAsset[]) => {
    setSelectedAssets((assets) =>
      assets.filter((selectedAsset) => !removedAssets.some((removedAsset) => removedAsset.id === selectedAsset.id))
    );
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  const onSelect = (asset: HygraphAsset) => {
    if (isSingleSelect) {
      return closeDialogWithResult([asset]);
    }

    addToSelection([asset]);
  };

  const isLoading = assetsQuery.isLoading || !assetsQuery.data;

  const assets = assetsQuery.data?.assets.map((asset): HygraphAsset => {
    return {
      createdAt: new Date(asset.attributes.date_created * 1000).toISOString(),
      createdBy: {
        name: asset.attributes.uploaded_by ?? ''
      },
      fileName: asset.attributes.origin_path.split('/').pop()!,
      size: asset.attributes.file_size,
      width: asset.attributes.media_width,
      height: asset.attributes.media_height,
      url: asset.attributes.origin_path,
      id: asset.id,
      handle: asset.attributes.origin_path,
      mimeType: asset.attributes.content_type,
      stage: 'published',
      updatedAt: new Date(asset.attributes.date_modified * 1000).toISOString(),
      updatedBy: {
        name: ''
      }
    };
  });

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
              assets={assets!}
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

        {!isSingleSelect ? (
          <DialogFooter
            closeDialog={() => closeDialogWithResult(selectedAssets)}
            selectedAssetCount={selectedAssets.length}
          />
        ) : null}
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

function DialogFooter({ closeDialog, selectedAssetCount }: { closeDialog: () => void; selectedAssetCount: number }) {
  const showAssetCount = selectedAssetCount > 1;
  const allowSubmit = selectedAssetCount > 0;

  return (
    <div className="flex justify-end rounded-b-lg bg-brand-50 px-24 py-16">
      <Button onClick={closeDialog} size="large" disabled={!allowSubmit}>
        Add selected assets {showAssetCount ? `(${selectedAssetCount})` : ''}
      </Button>
    </div>
  );
}
