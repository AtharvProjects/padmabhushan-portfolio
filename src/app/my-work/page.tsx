import { CategorySection } from "@/components/CategorySection";
import { getPhotos } from "@/lib/getPhotos";

export default async function MyWork() {
  const photoCategories = getPhotos();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-dark mb-4">
          Explore My Work
        </h1>
        <p className="text-sm md:text-base text-brand-dark/70 max-w-md mx-auto mb-6">
          Tap any category below to expand and view photographs.
        </p>
        <div className="w-24 h-px bg-brand-brown/30 mx-auto"></div>
      </div>
      
      {photoCategories.length === 0 ? (
        <p className="text-center text-gray-500">No photos found in the gallery.</p>
      ) : (
        <div className="space-y-6">
          {photoCategories.map((category) => (
            <CategorySection 
              key={category.id} 
              category={category} 
              isDefaultOpen={false} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
