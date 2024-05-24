import { Button } from '@/components/button';
import { Icon } from '@/types/common';
import { Box, Card } from '@hygraph/baukasten';
import { Close, DragHandle, FieldAsset } from '@hygraph/icons';

type AssetCardProps = {
  dragHandleProps?: { [x: string]: Function };
  id: string;
  onRemoveItem: (id: string) => void;
  isSingleAsset: boolean;
  imageUrl: string;
  name: string;
  isDragging?: boolean;
};

export const AssetCard = ({
  dragHandleProps,
  onRemoveItem,
  name,
  id,
  isSingleAsset,
  imageUrl,
  isDragging
}: AssetCardProps) => {
  const setCursor = (isSingleAsset: boolean, isDragging: boolean | undefined) => {
    if (isSingleAsset) {
      return 'default';
    }

    if (isDragging) {
      return 'grabbing';
    }

    return 'grab';
  };

  return (
    <Card className="flex h-[70px] max-h-[70px] items-center">
      {!isSingleAsset && (
        <div className="m-8 flex flex-col justify-center text-neutral-400" {...dragHandleProps}>
          {(DragHandle as Icon)({
            style: { fontSize: '0.8rem', cursor: setCursor(isSingleAsset, isDragging) }
          })}
        </div>
      )}
      <div className="ml-4 flex h-[70px] w-[70px] min-w-[70px] items-center justify-center">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={getResizedImgixUrl(imageUrl)} className="h-[70px] w-[70px] object-cover" />
          </>
        ) : (
          <Box as={FieldAsset} color="neutral.200" width={50} height={50} />
        )}
      </div>
      <div className="ml-4 items-center overflow-hidden">
        <p className="block overflow-hidden  text-ellipsis whitespace-nowrap text-sm font-medium text-neutral-500">
          {name || ''}
        </p>
      </div>
      <Button variant="ghostSecondary" size="icon" className="ml-auto mr-8" onClick={() => onRemoveItem(id)}>
        <Box as={Close} className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export const getResizedImgixUrl = (url: string) => {
  const params = new URLSearchParams({
    w: '120',
    h: '120'
  });
  return url + '?' + params.toString();
};
