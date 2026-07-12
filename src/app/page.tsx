import Link from "next/link";
import * as motion from "framer-motion/client";
import { getPhotos } from "@/lib/getPhotos";

export default async function Home() {
  const photoCategories = getPhotos();
  
  // Use the mountain selfie image from harishchandragad as the background
  let heroImage = "/gallery/Travel/harishchandragad/IMG20251228070142 (1).jpg";

  return (
    <div className="relative w-full h-[95vh] flex flex-col justify-start overflow-hidden pt-32 md:pt-40 lg:pt-48">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover"
        style={{
          backgroundImage: `url("${heroImage}")`,
          backgroundPosition: 'right 80%'
        }}
      />
      
      {/* Overlay removed to match original bright aesthetic, unless needed for readability */}
      {/* <div className="absolute inset-0 z-0 bg-white/10" /> */}

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[4.5rem] md:text-8xl lg:text-[7rem] font-serif text-[#2a211f] mb-4 leading-none tracking-tight"
          >
            Padmabhushan
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[1.1rem] md:text-xl text-[#2a211f] mb-1 font-medium"
          >
            Capturing moments.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs md:text-sm text-[#2a211f] mb-8 opacity-75"
          >
            Photographer.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/my-work"
              className="inline-block px-7 py-2.5 bg-[#4a3b38] text-white rounded-full text-sm font-medium hover:bg-[#2a211f] transition-colors"
            >
              My Work
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
