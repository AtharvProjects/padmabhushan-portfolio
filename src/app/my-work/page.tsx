import { CategorySection } from "@/components/CategorySection";
import { getPhotos } from "@/lib/getPhotos";

export default async function MyWork() {
  const photoCategories = getPhotos();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4">
          Explore. My Work.
        </h1>
        <div className="w-24 h-px bg-brand-brown/30 mx-auto"></div>
      </div>
      
      {photoCategories.length === 0 ? (
        <p className="text-center text-gray-500">No photos found in the gallery.</p>
      ) : (
        <div className="space-y-6">
          {photoCategories.map((category, index) => {
            // We can explicitly define which category is the "best work" by matching the title.
            // For now, we'll assume the first category is your "best work" and leave it open.
            // You can easily change this logic!
            const isBestWork = index === 0;

            return (
              <CategorySection 
                key={category.title} 
                category={category} 
                isDefaultOpen={isBestWork} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
