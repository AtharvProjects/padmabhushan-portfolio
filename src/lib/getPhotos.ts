import fs from 'fs';
import path from 'path';

export interface PhotoCategory {
  title: string;
  images: { id: string; src: string; alt: string }[];
}

export function getPhotos(): PhotoCategory[] {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  
  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  const result: PhotoCategory[] = [];
  
  // Recursively find directories and their images
  const findCategories = (dir: string, currentCategoryPath: string[]) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const imagesInThisDir: { id: string; src: string; alt: string }[] = [];
    
    for (const file of files) {
      if (file.isDirectory()) {
        findCategories(path.join(dir, file.name), [...currentCategoryPath, file.name]);
      } else {
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
          const imgPath = path.join(dir, file.name);
          const relativePath = path.relative(path.join(process.cwd(), 'public'), imgPath);
          const publicUrl = `/${relativePath.replace(/\\/g, '/')}`;
          
          imagesInThisDir.push({
            id: publicUrl,
            src: publicUrl,
            alt: file.name
          });
        }
      }
    }
    
    if (imagesInThisDir.length > 0) {
      // Format title like "Travel / Raigad Rajyabhishek" or just "Engineering"
      const title = currentCategoryPath.map(p => 
        p.charAt(0).toUpperCase() + p.slice(1) // capitalize
      ).join(' / ');
      
      result.push({
        title: title || 'Other',
        images: imagesInThisDir
      });
    }
  };

  findCategories(galleryDir, []);

  // Sort so that "Best Work" comes first
  result.sort((a, b) => {
    const aIsBest = a.title.toLowerCase().includes("best work");
    const bIsBest = b.title.toLowerCase().includes("best work");
    if (aIsBest && !bIsBest) return -1;
    if (!aIsBest && bIsBest) return 1;
    return a.title.localeCompare(b.title);
  });

  return result;
}
