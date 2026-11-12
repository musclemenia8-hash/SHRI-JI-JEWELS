import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

export const ShopByCategory: React.FC = () => {
  const { categories, setSelectedCategory } = useShop();

  // Representative supplied photos for each genuine category
  const categoryImages: Record<CategoryType, string> = {
    Chains: '/assets/aistudio/865418338_1794451764205964_d513dbd6.jpg',
    Rings: '/assets/aistudio/558287240_1794452222957945_241a3df9.jpg',
    'Bangles & Kada': '/assets/aistudio/225308150_1794454323494506_00304ec5.jpg',
    Bracelets: '/assets/aistudio/11018053_1794454513709750_0ee6e616.jpg',
    Pendants: '/assets/aistudio/55433097_1794452981472051_96949de7.jpg',
    Earrings: '/assets/aistudio/64919064_1794452743193533_a47e3c2c.jpg',
  };

  const categorySubtitles: Record<CategoryType, string> = {
    Chains: 'Milanese & Cuban Weaves',
    Rings: 'All Rings at Flat ₹1,500',
    'Bangles & Kada': 'Traditional Kada Pairs',
    Bracelets: 'Pavé & Curb Link Pieces',
    Pendants: 'Sacred Om & Deity Motifs',
    Earrings: 'Solitaire Huggie Accents',
  };

  const handleSelectCategory = (categoryName: CategoryType | 'All') => {
    setSelectedCategory(categoryName);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FBF8F2]" id="categories-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9E7D3B] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated By Category</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-royal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241A15]">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A42] font-light">
            Explore our verified collection across six traditional jewellery categories with direct artisan pricing.
          </p>
        </div>

        {/* SYSTEM 4: Exactly Two Category Cards Per Row across all screens */}
        {/* Uses CSS grid repeat(2, minmax(0, 1fr)) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const imgSrc = categoryImages[cat.name] || '/assets/aistudio/IMG_20261112_144610_4413d601.jpg';
            const subtitle = categorySubtitles[cat.name] || 'Handcrafted Quality';

            return (
              <div
                key={cat.name}
                onClick={() => handleSelectCategory(cat.name)}
                className="group relative rounded-lg overflow-hidden bg-white border border-[#C5A059]/30 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with Consistent Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFEB]">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  
                  {/* Item Count Tag */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-[11px] font-mono font-medium tracking-wide text-white bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm border border-white/20 tabular-nums">
                    {cat.count} Designs
                  </div>

                  {/* Corner Accent Arrow */}
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-2 left-2.5 right-10 sm:bottom-3 sm:left-4 sm:right-12 text-white">
                    <h3 className="font-royal text-sm sm:text-lg font-bold text-white tracking-wide truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#DFCA9B] font-light truncate">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom link strip */}
                <div className="p-2.5 sm:p-3 bg-white flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#241A15] group-hover:text-[#9E7D3B] transition-colors border-t border-[#F5EFEB]">
                  <span className="uppercase tracking-wider">Explore {cat.name}</span>
                  <span className="text-[#9E7D3B] hidden sm:inline">View Collection →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-width "Shop All" Banner beneath the 2-column grid */}
        <div className="max-w-4xl mx-auto mt-6">
          <div
            onClick={() => handleSelectCategory('All')}
            className="group relative rounded-lg overflow-hidden bg-gradient-to-r from-[#241A15] via-[#2D1F17] to-[#1E140F] text-[#FBF8F2] border border-[#C5A059]/40 p-4 sm:p-6 cursor-pointer shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                Complete Collection
              </span>
              <h3 className="font-royal text-base sm:text-xl font-bold text-white">
                Explore All 45 Verified Masterpieces
              </h3>
              <p className="text-xs text-[#DFCA9B]/80 font-light mt-0.5">
                Chains, signet rings, kada pairs, stone bracelets, and sacred pendants.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCategory('All');
              }}
              className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#9E7D3B] text-[#1A130F] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <span>Browse All</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
