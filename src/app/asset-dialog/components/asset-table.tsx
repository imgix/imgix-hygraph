import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Asset } from '@/types';
import { useDrag } from '@use-gesture/react';
import prettyBytes from 'pretty-bytes';
import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { User } from './user';
import FieldRelationIcon from '/public/icons/field-relation.svg';

type Column =
  | 'action'
  | 'preview'
  | 'id'
  | 'createdAt'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy'
  | 'handle'
  | 'fileName'
  | 'height'
  | 'width'
  | 'fileSize'
  | 'mimeType';

const resizableColumns: [Column, string][] = [
  ['id', 'ID'],
  ['createdAt', 'Created At'],
  ['createdBy', 'Created By'],
  ['updatedAt', 'Updated At'],
  ['updatedBy', 'Updated By'],
  ['handle', 'Handle'],
  ['fileName', 'File Name'],
  ['height', 'Height'],
  ['width', 'Width'],
  ['fileSize', 'Size'],
  ['mimeType', 'Mime Type']
];

const defaultColumnWidths: Record<Column, number> = {
  action: 60,
  preview: 80,
  id: 120,
  createdAt: 120,
  createdBy: 120,
  updatedAt: 120,
  updatedBy: 120,
  handle: 120,
  fileName: 120,
  height: 120,
  width: 120,
  fileSize: 120,
  mimeType: 120
};

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

  const [columnWidths, setColumnWidths] = useState<Record<Column, number>>(defaultColumnWidths);

  const handleResize = useCallback(
    (columnName: Column) => (deltaX: number) => {
      setColumnWidths((old) => {
        const oldWidth = old[columnName];
        const newWidth = oldWidth + deltaX;
        return {
          ...old,
          [columnName]: newWidth
        };
      });
    },
    [setColumnWidths]
  );

  const columnWidthVariablesStyle = useMemo(() => {
    const propertiesList = Object.entries(columnWidths).map(([columnName, width]) => {
      return [`--${columnName}-width`, String(width)];
    });

    return Object.fromEntries(propertiesList) as CSSProperties;
  }, [columnWidths]);

  return (
    <table style={columnWidthVariablesStyle}>
      <thead>
        <tr className="h-[28px] w-full border-b shadow-sm">
          <TableHeader name="action">
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

          <TableHeader name="preview">Preview</TableHeader>

          {resizableColumns.map(([name, label]) => (
            <TableHeader key={name} name={name} resizable onResize={handleResize(name)}>
              {label}
            </TableHeader>
          ))}
        </tr>
      </thead>

      <tbody>
        {assets.map((asset) => {
          const isSelected = selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id);

          return (
            <tr className="h-[60px] overflow-x-auto border-b" key={asset.id}>
              <TableCell name="action">
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

              <TableCell name="preview">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={asset.thumbnail} className="max-h-[60px] w-[80px] object-cover" />
              </TableCell>

              <TableCell name="id">
                <div className="w-full max-w-fit overflow-hidden text-ellipsis rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500">
                  {asset.id}
                </div>
              </TableCell>

              <TableCell name="createdAt">{formatDate(asset.createdAt)}</TableCell>

              <TableCell name="createdBy">
                {asset.createdBy ? <User name={asset.createdBy.name} picture={asset.createdBy.picture} /> : <p>-</p>}
              </TableCell>

              <TableCell name="updatedAt">{asset.updatedAt ? formatDate(asset.updatedAt) : '-'}</TableCell>

              <TableCell name="updatedBy">
                {asset.updatedBy ? <User name={asset.updatedBy.name} picture={asset.updatedBy.picture} /> : '-'}
              </TableCell>

              <TableCell name="handle">{asset.handle}</TableCell>

              <TableCell name="fileName">{asset.fileName}</TableCell>

              <TableCell name="height">
                <pre>{asset.height ?? '-'}</pre>
              </TableCell>

              <TableCell name="width">
                <pre>{asset.width ?? '-'}</pre>
              </TableCell>

              <TableCell name="fileSize">
                <pre>{prettyBytes(asset.fileSize)}</pre>
              </TableCell>

              <TableCell name="mimeType">{asset.mimeType}</TableCell>
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
  name
}: {
  children?: ReactNode;
  resizable?: boolean;
  onResize?: (deltaX: number) => void;
  name: Column;
}) => {
  const bind = useDrag(
    (state) => {
      onResize?.(state.delta[0]);
    },
    {
      bounds: {
        // base width is 120 so -40 is capping the width to 80
        left: -40
      }
    }
  );

  return (
    <th
      className="relative overflow-hidden text-ellipsis text-nowrap border-r px-2 text-left text-xs font-medium text-slate-500"
      style={getCellStyle(name)}
    >
      {children}
      {resizable ? <div className="absolute right-0 top-0 h-full w-5 cursor-ew-resize touch-none" {...bind()} /> : null}
    </th>
  );
};

const TableCell = ({ children, name }: { children?: ReactNode; name: Column }) => {
  return (
    <td className="overflow-hidden whitespace-nowrap py-0 pl-2 text-m" style={getCellStyle(name)}>
      {children}
    </td>
  );
};

const getCellStyle = (columnName: Column) => {
  const width = `calc(var(--${columnName}-width) * 1px)`;

  return {
    width: width,
    minWidth: width,
    maxWidth: width
  };
};

const formatDate = (date: Date) => {
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
};
