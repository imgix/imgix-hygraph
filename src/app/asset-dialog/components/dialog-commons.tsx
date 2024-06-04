import { Button } from '@/components/button';
import { Spinner } from '@/components/spinner';
import { type AppConfig } from '@/hooks/useAppConfig';
import { Asset } from '@/types';
import { useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { useEffect, useState } from 'react';
import { uniqueBy } from 'remeda';
import { useDebounceValue } from 'usehooks-ts';
import FieldAssetIcon from '/public/icons/field-asset.svg';

export function DialogHeader() {
  return (
    <div className="flex items-center space-x-12 border-b p-24">
      <FieldAssetIcon className="h-32 w-32 rounded bg-brand-100 p-2 text-brand-500" />
      <h4 className="text-lg font-medium">Select Asset</h4>
    </div>
  );
}

export function DialogFooter({
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

export function Loading() {
  return (
    <div className="grid h-full w-full place-items-center text-brand-500">
      <Spinner />
    </div>
  );
}

export const useAssetDialog = () => {
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

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounceValue(query, 250);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

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
    query,
    setQuery,
    debouncedQuery,
    ...rest
  };
};
