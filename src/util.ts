import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { Asset, HygraphAsset, ImgixAsset } from './types';
import { isNullish } from 'remeda';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['m'] }]
    }
  }
});

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export function hygraphAssetToAsset(asset: HygraphAsset, sourceBaseUrl: string): Asset {
  const getResizedHygraphUrl = (url: string, handle: string) => {
    const urlBase = url.slice(0, -handle.length);
    const formatParams = 'output=format:jpg/resize=width:59,height:59,fit:crop/';
    return urlBase + formatParams + handle;
  };

  return {
    id: asset.id,
    createdAt: new Date(asset.createdAt),
    createdBy: asset.createdBy,
    updatedAt: asset.updatedAt ? new Date(asset.updatedAt) : undefined,
    updatedBy: asset.updatedBy,
    handle: asset.handle,
    fileName: asset.fileName,
    height: asset.height,
    width: asset.width,
    fileSize: asset.size,
    mimeType: asset.mimeType,
    url: `${sourceBaseUrl}/${asset.handle}`,
    thumbnail: getResizedHygraphUrl(asset.url, asset.handle)
  };
}

export function imgixAssetToAsset(asset: ImgixAsset, sourceBaseUrl: string): Asset {
  const fileName = asset.attributes.origin_path.split('/').pop();
  if (isNullish(fileName)) {
    throw new Error('File name is null');
  }

  const url = sourceBaseUrl + asset.attributes.origin_path;

  return {
    id: asset.id,
    createdAt: new Date(asset.attributes.date_created * 1000),
    createdBy: asset.attributes.uploaded_by ? { name: asset.attributes.uploaded_by } : undefined,
    updatedAt: asset.attributes.date_modified ? new Date(asset.attributes.date_modified * 1000) : undefined,
    updatedBy: undefined,
    handle: asset.attributes.origin_path,
    fileName: fileName,
    height: asset.attributes.media_height ?? undefined,
    width: asset.attributes.media_width ?? undefined,
    fileSize: asset.attributes.file_size,
    mimeType: asset.attributes.content_type,
    url: url,
    thumbnail: `${url}?w=59&h=59&fit=crop`
  };
}
