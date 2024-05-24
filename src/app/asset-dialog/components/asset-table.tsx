import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Asset } from '@/types';
import { cn } from '@/util';
import { Box } from '@hygraph/baukasten';
import { FieldRelation } from '@hygraph/icons';
import prettyBytes from 'pretty-bytes';
import { type ReactNode } from 'react';
import { User } from './user';

export function AssetTable({
  removeFromSelection,
  onSelect,
  assets,
  selectedAssets,
  isSingleSelect,
  addToSelection
}: {
  removeFromSelection: (removedAssets: Asset[]) => void;
  onSelect: (asset: Asset) => void;
  assets: Asset[];
  selectedAssets: Asset[];
  isSingleSelect: boolean;
  addToSelection: (addedAssets: Asset[]) => void;
}) {
  const allSelected = assets.every((asset) => selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id));

  return (
    <table>
      <thead>
        <tr className="h-[28px] w-full border-b shadow-sm">
          <TableHeader className="w-[60px]">
            {!isSingleSelect ? (
              <div className="grid place-items-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => {
                    if (allSelected) {
                      return removeFromSelection(assets);
                    }

                    addToSelection(assets);
                  }}
                />
              </div>
            ) : null}
          </TableHeader>
          <TableHeader className="w-[130px]">Stages</TableHeader>
          <TableHeader className="w-[80px]">Preview</TableHeader>
          <TableHeader>ID</TableHeader>
          <TableHeader>Created At</TableHeader>
          <TableHeader>Created By</TableHeader>
          <TableHeader>Updated At</TableHeader>
          <TableHeader>Updated By</TableHeader>
          <TableHeader>Handle</TableHeader>
          <TableHeader>File Name</TableHeader>
          <TableHeader>Height</TableHeader>
          <TableHeader>Width</TableHeader>
          <TableHeader>Size</TableHeader>
          <TableHeader>Mime Type</TableHeader>
        </tr>
      </thead>

      <tbody>
        {assets.map((asset) => {
          const isSelected = selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id);

          return (
            <tr className="h-[60px] overflow-x-auto border-b" key={asset.id}>
              <TableCell className="min-w-[60px]">
                <div className="grid place-items-center">
                  {isSingleSelect ? (
                    <SelectAssetButton onClick={() => onSelect(asset)} />
                  ) : (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        if (isSelected) {
                          return removeFromSelection([asset]);
                        }

                        onSelect(asset);
                      }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="min-w-[130px]"></TableCell>
              <TableCell className="min-w-[80px]">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={asset.thumbnail} className="max-h-[60px] w-[80px] object-cover" />
              </TableCell>

              <TableCell>
                <div className="w-full max-w-[110px] overflow-hidden text-ellipsis rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500">
                  {asset.id}
                </div>
              </TableCell>
              <TableCell>{formatDate(asset.createdAt)}</TableCell>
              <TableCell>
                {asset.createdBy ? <User name={asset.createdBy.name} picture={asset.createdBy.picture} /> : <p>-</p>}
              </TableCell>
              <TableCell>{asset.updatedAt ? formatDate(asset.updatedAt) : '-'}</TableCell>
              <TableCell>
                {asset.updatedBy ? <User name={asset.updatedBy.name} picture={asset.updatedBy.picture} /> : '-'}
              </TableCell>
              <TableCell>{asset.handle}</TableCell>
              <TableCell>{asset.fileName}</TableCell>
              <TableCell>
                <pre>{asset.height ?? '-'}</pre>
              </TableCell>
              <TableCell>
                <pre>{asset.width ?? '-'}</pre>
              </TableCell>
              <TableCell>
                <pre>{prettyBytes(asset.fileSize)}</pre>
              </TableCell>
              <TableCell>{asset.mimeType}</TableCell>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const TableHeader = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <th className={cn('w-[120px] border-r px-2 text-left text-xs font-medium text-slate-500', className)}>
      {children}
    </th>
  );
};

const TableCell = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <td className={cn('min-w-[120px] max-w-[120px] overflow-hidden whitespace-nowrap px-2 py-0 text-m', className)}>
      {children}
    </td>
  );
};

function SelectAssetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Box as={FieldRelation} className="h-4 w-4" />
    </Button>
  );
}

const formatDate = (date: Date) => {
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
};
