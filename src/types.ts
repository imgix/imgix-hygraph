export type HygraphAsset = {
  createdAt: string;
  fileName: string;
  handle: string;
  height: number;
  id: string;
  size: number;
  stage: string;
  updatedAt: string;
  width: number;
  mimeType: string;
  url: string;
  createdBy: {
    picture?: string;
    name: string;
  };
  updatedBy: {
    picture?: string;
    name: string;
  };
};

export type ImgixAsset = {
  id: string;
  attributes: {
    content_type: string;
    date_created: number;
    date_modified: number | null;
    uploaded_by: string | null;
    file_size: number;
    media_kind: string;
    media_height: number | null;
    media_width: number | null;
    origin_path: string;
  };
};

export type Asset = {
  id: string;
  createdAt: Date;
  createdBy?: {
    name: string;
    picture?: string;
  };
  updatedAt?: Date;
  updatedBy?: {
    name: string;
    picture?: string;
  };
  handle?: string;
  fileName: string;
  height?: number;
  width?: number;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnail: string;
};
