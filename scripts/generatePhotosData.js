const fs = require("fs");
const path = require("path");

function formatTitle(name) {
  const lower = name.toLowerCase().trim();
  if (lower === "human portraits") return "Human Portraits";
  if (lower === "culture and documents") return "Culture & Documents";
  if (lower === "pets and animals") return "Pets & Animals";
  if (lower === "mai ghat satara") return "Mai Ghat Satara";
  if (lower === "bagad bavdhan") return "Bagad Bavdhan";
  if (lower === "kas plateau") return "Kas Plateau";
  if (lower === "sandhan valley") return "Sandhan Valley";
  if (lower === "raigad rajyabhishek") return "Raigad Rajyabhishek";
  if (lower === "my best work") return "My Best Work";
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const galleryDir = path.join(process.cwd(), "public", "gallery");
if (!fs.existsSync(galleryDir)) {
  console.log("No gallery directory found.");
  process.exit(0);
}

const mainDirEntries = fs.readdirSync(galleryDir, { withFileTypes: true });
const mainCategories = [];

for (const entry of mainDirEntries) {
  if (!entry.isDirectory()) continue;
  const mainCategoryName = entry.name;
  const mainFolderPath = path.join(galleryDir, mainCategoryName);
  const subDirEntries = fs.readdirSync(mainFolderPath, { withFileTypes: true });
  const subCategories = [];
  const directImages = [];

  for (const subEntry of subDirEntries) {
    const subPath = path.join(mainFolderPath, subEntry.name);
    if (subEntry.isDirectory()) {
      const imageFiles = fs.readdirSync(subPath, { withFileTypes: true });
      const subImages = [];
      for (const imgFile of imageFiles) {
        if (!imgFile.isDirectory() && /\.(jpg|jpeg|png|gif|webp)$/i.test(imgFile.name)) {
          const relativePath = path.relative(path.join(process.cwd(), "public"), path.join(subPath, imgFile.name));
          const publicUrl = "/" + relativePath.replace(/\\/g, "/");
          subImages.push({ id: publicUrl, src: publicUrl, alt: imgFile.name });
        }
      }
      if (subImages.length > 0) {
        subCategories.push({
          id: subEntry.name.toLowerCase().replace(/\s+/g, "-"),
          title: formatTitle(subEntry.name),
          images: subImages,
        });
      }
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(subEntry.name)) {
      const relativePath = path.relative(path.join(process.cwd(), "public"), subPath);
      const publicUrl = "/" + relativePath.replace(/\\/g, "/");
      directImages.push({ id: publicUrl, src: publicUrl, alt: subEntry.name });
    }
  }

  if (mainCategoryName.toLowerCase() === "photography") {
    subCategories.sort((a, b) => {
      if (a.title === "My Best Work") return -1;
      if (b.title === "My Best Work") return 1;
      return a.title.localeCompare(b.title);
    });
  } else {
    subCategories.sort((a, b) => a.title.localeCompare(b.title));
  }

  const allImages = [...directImages, ...subCategories.flatMap((sc) => sc.images)];
  if (allImages.length > 0) {
    mainCategories.push({
      id: mainCategoryName.toLowerCase(),
      title: formatTitle(mainCategoryName),
      subCategories,
      allImages,
    });
  }
}

const preferredOrder = ["padmabhushan", "photography", "travel"];
mainCategories.sort((a, b) => {
  const idxA = preferredOrder.indexOf(a.id);
  const idxB = preferredOrder.indexOf(b.id);
  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;
  return a.title.localeCompare(b.title);
});

const outPath = path.join(process.cwd(), "src", "lib", "photosData.json");
fs.writeFileSync(outPath, JSON.stringify(mainCategories, null, 2));
console.log("Successfully generated photosData.json with", mainCategories.length, "categories!");
