import { Button } from '@/components/button';
import CloseIcon from '/public/icons/close.svg';
import DragHandleIcon from '/public/icons/drag-handle.svg';
import FieldAssetIcon from '/public/icons/field-asset.svg';
import { cn } from '@/util';

type AssetCardProps = {
  dragHandleProps?: { [x: string]: Function };
  id: string;
  onRemoveItem: (id: string) => void;
  isSingleAsset: boolean;
  imageUrl: string;
  name: string;
  isDragging?: boolean;
  isReadOnly?: boolean;
};

export const AssetCard = ({
  dragHandleProps,
  onRemoveItem,
  name,
  id,
  isSingleAsset,
  imageUrl,
  isDragging,
  isReadOnly
}: AssetCardProps) => {
  const getCursor = (isSingleAsset: boolean, isDragging: boolean | undefined) => {
    if (isSingleAsset) return 'cursor-default';
    if (isDragging) return 'cursor-grabbing';
    return 'cursor-grab';
  };

  return (
    <div className="flex h-[70px] max-h-[70px] items-center rounded border border-neutral-100 bg-white shadow-md shadow-black/5">
      {!isSingleAsset && !isReadOnly ? (
        <div className="m-8 flex flex-col justify-center text-neutral-400" {...dragHandleProps}>
          <DragHandleIcon className={cn('h-2.5 text-[0.8rem]', getCursor(isSingleAsset, isDragging))} />
        </div>
      ) : null}
      <div className="ml-4 flex h-[70px] w-[70px] min-w-[70px] items-center justify-center">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={getResizedImgixUrl(imageUrl)} className="h-[70px] w-[70px] object-cover" />
          </>
        ) : (
          <FieldAssetIcon className="h-[50px] w-[50px] text-neutral-200" />
        )}
      </div>
      <div className="ml-4 items-center overflow-hidden">
        <p className="block overflow-hidden  text-ellipsis whitespace-nowrap text-sm font-medium text-neutral-500">
          {name || ''}
        </p>
      </div>
      {!isReadOnly ? (
        <Button variant="ghostSecondary" size="icon" className="ml-auto mr-8" onClick={() => onRemoveItem(id)}>
          <CloseIcon className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
};

export const getResizedImgixUrl = (url: string) => {
  const params = new URLSearchParams({
    w: '120',
    h: '120'
  });
  return url + '?' + params.toString();
};
