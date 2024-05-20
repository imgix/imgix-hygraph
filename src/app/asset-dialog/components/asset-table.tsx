import { Checkbox } from '@/components/checkbox';
import { cn } from '@/util';
import { IconButton, Pill } from '@hygraph/baukasten';
import { FieldRelation } from '@hygraph/icons';
import prettyBytes from 'pretty-bytes';
import { type ReactNode } from 'react';
import { HygraphAsset } from '../useHygraphAssets';
import { User } from './user';

export function AssetTable({
  removeFromSelection,
  onSelect,
  assets,
  selectedAssets,
  isSingleSelect,
  addToSelection
}: {
  removeFromSelection: (removedAssets: HygraphAsset[]) => void;
  onSelect: (asset: HygraphAsset) => void;
  assets: HygraphAsset[];
  selectedAssets: HygraphAsset[];
  isSingleSelect: boolean;
  addToSelection: (addedAssets: HygraphAsset[]) => void;
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
                <img
                  src={getResizedHygraphUrl(asset.url, asset.handle)}
                  className="max-h-[60px] w-[80px] object-cover"
                />
              </TableCell>
              <TableCell>
                <Pill maxWidth={110} size="24">
                  {asset.id}
                </Pill>
              </TableCell>
              <TableCell>{formatDate(new Date(asset.createdAt))}</TableCell>
              <TableCell>
                <User name={asset.createdBy.name} picture={asset.createdBy.picture} />
              </TableCell>
              <TableCell>{formatDate(new Date(asset.updatedAt))}</TableCell>
              <TableCell>
                <User name={asset.updatedBy.name} picture={asset.updatedBy.picture} />
              </TableCell>
              <TableCell>{asset.handle}</TableCell>
              <TableCell>{asset.fileName}</TableCell>
              <TableCell>
                <pre>{asset.height}</pre>
              </TableCell>
              <TableCell>
                <pre>{asset.width}</pre>
              </TableCell>
              <TableCell>
                <pre>{prettyBytes(asset.size)}</pre>
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
    <td className={cn('min-w-[120px] max-w-[120px] overflow-hidden whitespace-nowrap px-2 text-m', className)}>
      {children}
    </td>
  );
};

function SelectAssetButton({ onClick }: { onClick: () => void }) {
  return <IconButton variant="ghost" variantColor="primary" icon={FieldRelation} onClick={onClick} />;
}

const getResizedHygraphUrl = (url: string, handle: string) => {
  return url.slice(0, -handle.length) + 'output=format:jpg/resize=width:59,height:59,fit:crop/' + handle;
};

const formatDate = (date: Date) => {
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
};
