import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Asset } from '@/types';
import { cn } from '@/util';
import { useDrag } from '@use-gesture/react';
import prettyBytes from 'pretty-bytes';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { User } from './user';
import FieldRelationIcon from '/public/icons/field-relation.svg';

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

  const [w, setW] = useState(120);

  return (
    <table>
      <thead>
        <tr className="h-[28px] w-full border-b shadow-sm">
          <TableHeader>
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
          <TableHeader>Preview</TableHeader>
          <TableHeader>ID</TableHeader>
          <TableHeader
            resizable
            onResize={setW}
            style={{
              // @ts-ignore
              '--created-at-width': `${w}`,
              width: `calc(var(--created-at-width) * 1px)`,
              minWidth: `calc(var(--created-at-width) * 1px)`,
              maxWidth: `calc(var(--created-at-width) * 1px)`
            }}
          >
            Created At
          </TableHeader>
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
                    <Button variant="ghost" size="icon" onClick={() => onSelect(asset)}>
                      <FieldRelationIcon className="h-4 w-4" />
                    </Button>
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
              <TableCell className="min-w-[80px]">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={asset.thumbnail} className="max-h-[60px] w-[80px] object-cover" />
              </TableCell>

              <TableCell>
                <div className="w-full max-w-[110px] overflow-hidden text-ellipsis rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500">
                  {asset.id}
                </div>
              </TableCell>

              <TableCell
                style={{
                  width: `${w}px`,
                  minWidth: `${w}px`,
                  maxWidth: `${w}px`
                }}
              >
                {formatDate(asset.createdAt)}
              </TableCell>

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

const TableHeader = ({
  children,
  resizable,
  onResize,
  style
}: {
  children?: ReactNode;
  resizable?: boolean;
  onResize?: (setW: (oldWidth: number) => number) => void;
  style?: CSSProperties;
}) => {
  const bind = useDrag(
    (event) => {
      onResize?.((old) => {
        const newWidth = old + event.delta[0];
        return Math.max(newWidth, 120);
      });
    },
    {
      axis: 'x',
      bounds: {
        left: 0
      }
    }
  );

  return (
    <th
      className="relative overflow-hidden text-ellipsis text-nowrap border-r px-2 text-left text-xs font-medium text-slate-500"
      style={style}
    >
      {children}
      {resizable ? <div className="absolute right-0 top-0 h-full w-5 cursor-ew-resize" {...bind()} /> : null}
    </th>
  );
};

const TableCell = ({
  children,
  className,
  style
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <td
      className={cn('min-w-[120px] max-w-[120px] overflow-hidden whitespace-nowrap py-0 pl-2 text-m', className)}
      style={style}
    >
      {children}
    </td>
  );
};

const formatDate = (date: Date) => {
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
};
