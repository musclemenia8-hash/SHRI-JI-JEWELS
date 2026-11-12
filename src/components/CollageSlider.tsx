import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CollageProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface CollageSlide {
  id: string;
  themeTitle: string;
  themeSubtitle: string;
  description: string;
  products: [CollageProduct, CollageProduct, CollageProduct, CollageProduct]; // Exactly 4 square items
}

const COLLAGE_SLIDES: CollageSlide[] = [
  {
    id: 'collage-1',
    themeTitle: 'The Royal Heritage Ensemble',
    themeSubtitle: 'Bridal Kada, Mesh Chain, Devotional Om & Sphere Ring',
    description: 'An integrated composition celebrating classic Indian goldsmithing with warm 22K lustre finish.',
    products: [
      {
        id: 'SJJ-BG-09',
        name: "Women's Traditional Bridal Kada Stack",
        category: 'Bangles & Kada',
        price: 2000,
        image: '/assets/aistudio/940934097_1794452500992757_d037c26d.jpg',
      },
      {
        id: 'SJJ-CH-01',
        name: "Men's Gold Tone Flat Mesh Chain",
        category: 'Chains',
        price: 1900,
        image: '/assets/aistudio/865418338_1794451764205964_d513dbd6.jpg',
      },
      {
        id: 'SJJ-PD-03',
        name: 'Unisex Sacred Om Sunburst Pendant',
        category: 'Pendants',
        price: 2500,
        image: '/assets/aistudio/55433097_1794452981472051_96949de7.jpg',
      },
      {
        id: 'SJJ-RG-01',
        name: "Women's Triple Sphere Open Cuff Ring",
        category: 'Rings',
        price: 1500,
        image: '/assets/aistudio/1068828712_1794451888518998_e3f1acce.jpg',
      },
    ],
  },
  {
    id: 'collage-2',
    themeTitle: 'Sovereign Links & Devotion',
    themeSubtitle: 'Wheat Link Chain, Greek Kada, Khanda Ring & Stone Huggies',
    description: 'Structured masculine chains and protective traditional symbols forged with meticulous detail.',
    products: [
      {
        id: 'SJJ-CH-02',
        name: "Men's Twisted Wheat Link Chain",
        category: 'Chains',
        price: 2100,
        image: '/assets/aistudio/870198973_1794453028945893_20a7b9dc.jpg',
      },
      {
        id: 'SJJ-BG-01',
        name: "Men's Dual-Tone Greek Pattern Kada Pair",
        category: 'Bangles & Kada',
        price: 2000,
        image: '/assets/aistudio/225308150_1794454323494506_00304ec5.jpg',
      },
      {
        id: 'SJJ-RG-12',
        name: "Men's Sikh Khanda Sahib Signet Ring",
        category: 'Rings',
        price: 1500,
        image: '/assets/aistudio/1025799523_1794454301218067_e7d7fa88.jpg',
      },
      {
        id: 'SJJ-ER-01',
        name: "Women's Stone Studded Huggie Earrings",
        category: 'Earrings',
        price: 1200,
        image: '/assets/aistudio/64919064_1794452743193533_a47e3c2c.jpg',
      },
    ],
  },
  {
    id: 'collage-3',
    themeTitle: 'Rajputana Splendor & Pavé',
    themeSubtitle: 'Cuban Curb Chain, Ruby Kada, Pavé Bracelet & Hanuman Ji Pendant',
    description: 'Vibrant ruby stone inlays, high-gloss Cuban link weave, and sacred Gada icon.',
    products: [
      {
        id: 'SJJ-CH-06',
        name: "Men's Classic Cuban Curb Chain",
        category: 'Chains',
        price: 2200,
        image: '/assets/aistudio/452037013_1794454423303787_84faaa14.jpg',
      },
      {
        id: 'SJJ-BG-02',
        name: "Women's Traditional Ruby Filigree Kada Pair",
        category: 'Bangles & Kada',
        price: 2000,
        image: '/assets/aistudio/391020273_1794454363807556_efd7808a.jpg',
      },
      {
        id: 'SJJ-BR-01',
        name: "Men's Stone Encrusted Cuban Bracelet",
        category: 'Bracelets',
        price: 1800,
        image: '/assets/aistudio/11018053_1794454513709750_0ee6e616.jpg',
      },
      {
        id: 'SJJ-PD-01',
        name: "Men's Shri Hanuman Ji Gada Pendant",
        category: 'Pendants',
        price: 2200,
        image: '/assets/aistudio/340599142_1794454541881893_579f5de6.jpg',
      },
    ],
  },
];

export const CollageSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { products, setSelectedProduct } = useShop();

  // Touch swipe support for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleOpenProduct = (id: string) => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const nextCollage = () => {
    setCurrentIdx((prev) => (prev + 1) % COLLAGE_SLIDES.length);
  };

  const prevCollage = () => {
    setCurrentIdx((prev) => (prev - 1 + COLLAGE_SLIDES.length) % COLLAGE_SLIDES.length);
  };

  // Optional gentle autoplay that pauses on hover (7 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextCollage();
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, currentIdx]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextCollage(); // Swiped left -> next
      } else {
        prevCollage(); // Swiped right -> prev
      }
    }
  };

  const current = COLLAGE_SLIDES[currentIdx];

  return (
    <section
      className="py-12 sm:py-16 bg-[#F5EFEB] select-none"
      id="collage-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#C5A059]/25 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9E7D3B] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated 4-Photo Editorial Collage</span>
            </div>
            <h2 className="font-royal text-xl sm:text-2xl lg:text-3xl font-bold text-[#241A15] mt-0.5">
              {current.themeTitle}
            </h2>
            <p className="text-xs text-[#5A4A42] font-light mt-0.5">
              {current.themeSubtitle}
            </p>
          </div>

          {/* Controls: Slide Counter & Prev/Next Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono tabular-nums text-[#5A4A42]">
              0{currentIdx + 1} / 0{COLLAGE_SLIDES.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevCollage}
                className="p-2 rounded-full border border-[#C5A059]/40 bg-white hover:bg-[#FBF8F2] text-[#241A15] transition-colors cursor-pointer"
                aria-label="Previous Collage"
                title="Previous Collage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextCollage}
                className="p-2 rounded-full border border-[#C5A059]/40 bg-white hover:bg-[#FBF8F2] text-[#241A15] transition-colors cursor-pointer"
                aria-label="Next Collage"
                title="Next Collage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SYSTEM 6: Single Integrated 2 × 2 Square Photo Collage Composition */}
        <div className="relative rounded-lg overflow-hidden border border-[#C5A059]/35 bg-[#241A15] shadow-xl">
          <div
            key={current.id}
            className="grid grid-cols-2 divide-x divide-y divide-[#C5A059]/30 transition-opacity duration-500 ease-out"
          >
            {current.products.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenProduct(item.id)}
                className="group relative aspect-square bg-[#1E140F] overflow-hidden cursor-pointer flex flex-col justify-end p-3 sm:p-5"
              >
                {/* 100% Square Photograph with Suitable Object-Fit */}
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Details Overlay */}
                <div className="relative z-10 flex flex-col justify-end">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#DFCA9B] font-semibold truncate">
                    {item.category}
                  </span>
                  
                  <h3 className="font-royal text-xs sm:text-sm md:text-base font-bold text-white line-clamp-1 leading-tight group-hover:text-[#DFCA9B] transition-colors">
                    {item.name}
                  </h3>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white tabular-nums">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    
                    <span className="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots Indicators */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {COLLAGE_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'w-6 bg-[#C5A059]' : 'w-2 bg-[#C5A059]/30 hover:bg-[#C5A059]/60'
              }`}
              aria-label={`Go to Collage ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
