import photosData from './photosData.json';

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
}

export interface SubCategory {
  id: string;
  title: string;
  images: PhotoItem[];
}

export interface MainCategory {
  id: string;
  title: string;
  subCategories: SubCategory[];
  allImages: PhotoItem[];
}

export function getPhotos(): MainCategory[] {
  return photosData as MainCategory[];
}
