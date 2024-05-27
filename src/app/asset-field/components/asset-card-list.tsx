import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AssetCard } from '@/app/asset-field/components/asset-card';
import { DragEndEvent } from '@dnd-kit/core/dist/types/events';
import { StoredAsset } from '@/types';
import { DraggableAssetCardContainer } from './draggable-asset-card-container';

type AssetCardListProps = {
  assets: StoredAsset[];
  handleOnRemoveItem: (id: string) => void;
  handleOnDragEnd: (event: DragEndEvent) => void;
  isDraggingDisabled: boolean;
  isReadOnly: boolean;
};

type AssetCardWrapperProps = {
  assets: StoredAsset[];
  handleOnRemoveItem: (id: string) => void;
  handleOnDragEnd?: (event: DragEndEvent) => void;
  isReadOnly: boolean;
};

export const AssetCardList = ({
  assets,
  handleOnRemoveItem,
  handleOnDragEnd,
  isDraggingDisabled,
  isReadOnly
}: AssetCardListProps) => {
  return (
    <section className="flex flex-col gap-2">
      {isDraggingDisabled ? (
        <NonDraggableAssetCardWrapper assets={assets} handleOnRemoveItem={handleOnRemoveItem} isReadOnly={isReadOnly} />
      ) : (
        <DraggableAssetCardWrapper
          assets={assets}
          handleOnRemoveItem={handleOnRemoveItem}
          handleOnDragEnd={handleOnDragEnd}
          isReadOnly={isReadOnly}
        />
      )}
    </section>
  );
};

const DraggableAssetCardWrapper = ({
  assets,
  handleOnRemoveItem,
  handleOnDragEnd,
  isReadOnly
}: AssetCardWrapperProps) => {
  const isSingleAsset = assets.length === 1;

  return (
    <DndContext
      onDragEnd={handleOnDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={assets} strategy={verticalListSortingStrategy}>
        {assets.map((asset) => (
          <DraggableAssetCardContainer id={asset.id} key={asset.id}>
            {({ dragHandleProps, isDragging }) => (
              <AssetCard
                imageUrl={asset.url}
                name={asset.id}
                onRemoveItem={handleOnRemoveItem}
                dragHandleProps={dragHandleProps}
                isDragging={isDragging}
                isSingleAsset={isSingleAsset}
                isReadOnly={isReadOnly}
                {...asset}
              />
            )}
          </DraggableAssetCardContainer>
        ))}
      </SortableContext>
    </DndContext>
  );
};

const NonDraggableAssetCardWrapper = ({ assets, handleOnRemoveItem, isReadOnly }: AssetCardWrapperProps) => {
  if (assets.length < 1) return null;

  return (
    <AssetCard
      imageUrl={assets[0].url}
      name={assets[0].id}
      isSingleAsset
      onRemoveItem={handleOnRemoveItem}
      isReadOnly={isReadOnly}
      {...assets[0]}
    />
  );
};
