import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, CustomerReview, FAQItem, CategoryType, AudienceType, CheckoutFormData } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_FAQS } from '../data/products';
import {
  runDuplicateDetection,
  getStoredDuplicateReport,
  dismissDuplicatePair,
  DuplicateReport
} from '../utils/duplicateDetector';
import {
  auditCatalogue,
  CatalogueAuditSummary,
  generateFlipkartMyntraTitle,
  generateFlipkartMyntraDescription
} from '../utils/qualityControl';

interface ShopContextType {
  products: Product[];
  categories: { name: CategoryType; count: number }[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  selectedCategory: CategoryType | 'All';
  selectedAudience: AudienceType | 'All';
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
  
  // Modals / Drawers
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  isAdminOpen: boolean;
  isPolicyOpen: boolean;
  isReviewModalOpen: boolean;
  selectedProduct: Product | null;

  // Actions
  setSelectedCategory: (cat: CategoryType | 'All') => void;
  setSelectedAudience: (aud: AudienceType | 'All') => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'newest') => void;
  
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsPolicyOpen: (open: boolean) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setSelectedProduct: (prod: Product | null) => void;

  // Cart & Wishlist operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  cartCount: number;
  cartSubtotal: number;
  
  // Reviews
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>) => void;
  toggleReviewApproval: (id: string) => void;

  // FAQs
  faqs: FAQItem[];

  // Admin operations
  updateProduct: (updated: Product) => void;
  addProduct: (newProd: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaultCatalogue: () => void;

  // SYSTEM 1: Duplicate Detection & Removal System
  duplicateReport: DuplicateReport | null;
  runDuplicateCheck: () => DuplicateReport;
  mergeDuplicates: (canonicalId: string, duplicateId: string) => void;
  dismissDuplicate: (idA: string, idB: string) => void;

  // SYSTEM 2: Listing Quality Control System
  qualitySummary: CatalogueAuditSummary | null;
  runQualityAuditCheck: () => CatalogueAuditSummary;
  applyQualityFixes: () => void;

  // WhatsApp order builder
  createWhatsAppOrderUrl: (formData: CheckoutFormData, directProduct?: Product) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback with automatic duplicate removal
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sjj_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        const { cleanProducts } = runDuplicateDetection(parsed, { autoRemoveConfirmed: true });
        return cleanProducts;
      }
    } catch {
      // fallback
    }
    const { cleanProducts } = runDuplicateDetection(INITIAL_PRODUCTS, { autoRemoveConfirmed: true });
    return cleanProducts;
  });

  const [duplicateReport, setDuplicateReport] = useState<DuplicateReport | null>(() => {
    return getStoredDuplicateReport() || runDuplicateDetection(INITIAL_PRODUCTS, { autoRemoveConfirmed: true }).report;
  });

  const [qualitySummary, setQualitySummary] = useState<CatalogueAuditSummary | null>(() => {
    return auditCatalogue(INITIAL_PRODUCTS);
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sjj_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sjj_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('sjj_reviews');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem('sjj_products_v4', JSON.stringify(products));
    } catch {
      // ignore
    }
    // Update Quality summary whenever products change
    setQualitySummary(auditCatalogue(products));
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('sjj_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sjj_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sjj_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  // Derived Category Counts strictly from active clean products
  const categories = useMemo(() => {
    const list: CategoryType[] = ['Chains', 'Rings', 'Bangles & Kada', 'Bracelets', 'Pendants', 'Earrings'];
    return list.map((cat) => ({
      name: cat,
      count: products.filter((p) => p.primaryCategory === cat).length,
    }));
  }, [products]);

  // Cart Counts & Subtotal
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Reviews
  const addReview = (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      isApproved: false, // Moderate by default per safety requirements
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  // Admin operations
  const updateProduct = (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      // Re-run duplicate detection on edit per System 1.D
      const { cleanProducts, report } = runDuplicateDetection(next, { autoRemoveConfirmed: true });
      setDuplicateReport(report);
      return cleanProducts;
    });
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => {
      const next = [newProd, ...prev];
      // Re-run duplicate detection on new product upload per System 1.D
      const { cleanProducts, report } = runDuplicateDetection(next, { autoRemoveConfirmed: true });
      setDuplicateReport(report);
      return cleanProducts;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    removeFromCart(id);
    setWishlist((prev) => prev.filter((wId) => wId !== id));
  };

  const resetToDefaultCatalogue = () => {
    const { cleanProducts, report } = runDuplicateDetection(INITIAL_PRODUCTS, { autoRemoveConfirmed: true });
    setProducts(cleanProducts);
    setDuplicateReport(report);
    setQualitySummary(auditCatalogue(cleanProducts));
  };

  // SYSTEM 1: Duplicate Actions
  const runDuplicateCheck = () => {
    const { cleanProducts, report } = runDuplicateDetection(products, { autoRemoveConfirmed: true });
    setProducts(cleanProducts);
    setDuplicateReport(report);
    return report;
  };

  const mergeDuplicates = (canonicalId: string, duplicateId: string) => {
    // Preserve canonical product, remove redundant duplicate, update cart/wishlist
    setProducts((prev) => prev.filter((p) => p.id !== duplicateId));
    setCart((prev) => {
      const dupItem = prev.find((i) => i.product.id === duplicateId);
      if (!dupItem) return prev;
      const canonicalProd = products.find((p) => p.id === canonicalId);
      if (!canonicalProd) return prev.filter((i) => i.product.id !== duplicateId);
      
      const filtered = prev.filter((i) => i.product.id !== duplicateId);
      const existingCan = filtered.find((i) => i.product.id === canonicalId);
      if (existingCan) {
        return filtered.map((i) =>
          i.product.id === canonicalId ? { ...i, quantity: i.quantity + dupItem.quantity } : i
        );
      }
      return [...filtered, { product: canonicalProd, quantity: dupItem.quantity }];
    });
    setWishlist((prev) => {
      const filtered = prev.filter((id) => id !== duplicateId);
      if (!filtered.includes(canonicalId)) filtered.push(canonicalId);
      return filtered;
    });
    // Re-run scan
    setTimeout(() => runDuplicateCheck(), 100);
  };

  const dismissDuplicate = (idA: string, idB: string) => {
    dismissDuplicatePair(idA, idB);
    runDuplicateCheck();
  };

  // SYSTEM 2: Listing Quality Actions
  const runQualityAuditCheck = () => {
    const summary = auditCatalogue(products);
    setQualitySummary(summary);
    return summary;
  };

  const applyQualityFixes = () => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        name: generateFlipkartMyntraTitle(p),
        description: generateFlipkartMyntraDescription(p),
      }))
    );
  };

  // WhatsApp Order URL Generator
  const createWhatsAppOrderUrl = (formData: CheckoutFormData, directProduct?: Product) => {
    const phoneNumber = '919315741495'; // Official verified helpline
    
    let itemsText = '';
    let totalAmt = 0;

    if (directProduct) {
      itemsText = `1x ${directProduct.name} (${directProduct.id}) — ₹${directProduct.sellingPrice.toLocaleString('en-IN')}`;
      totalAmt = directProduct.sellingPrice;
    } else {
      itemsText = cart
        .map(
          (item) =>
            `${item.quantity}x ${item.product.name} (${item.product.id}) — ₹${(
              item.product.sellingPrice * item.quantity
            ).toLocaleString('en-IN')}`
        )
        .join('\n');
      totalAmt = cartSubtotal;
    }

    const message = `*NEW ORDER BOOKING — SHRI JI JEWELS*
----------------------------------------
*Customer Details:*
• *Name:* ${formData.fullName}
• *Mobile:* ${formData.mobileNumber}
• *Address:* ${formData.address}
• *City / State:* ${formData.city}, ${formData.state}
• *PIN Code:* ${formData.pinCode}
${formData.notes ? `• *Notes:* ${formData.notes}\n` : ''}
----------------------------------------
*Ordered Pieces:*
${itemsText}
----------------------------------------
*Financial Summary:*
• *Total Order Value:* ₹${totalAmt.toLocaleString('en-IN')}
• *Mandatory Advance Token:* ₹200 (Required for Dispatch)
• *Remaining Balance on Tracking:* ₹${Math.max(0, totalAmt - 200).toLocaleString('en-IN')}

_I confirm that I have reviewed the order policies (No COD, ₹200 advance dispatch, no exchange/return). Please share UPI QR for advance payment._`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        selectedCategory,
        selectedAudience,
        searchQuery,
        sortBy,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isCheckoutOpen,
        isAdminOpen,
        isPolicyOpen,
        isReviewModalOpen,
        selectedProduct,
        setSelectedCategory,
        setSelectedAudience,
        setSearchQuery,
        setSortBy,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setIsAdminOpen,
        setIsPolicyOpen,
        setIsReviewModalOpen,
        setSelectedProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        reviews,
        addReview,
        toggleReviewApproval,
        faqs,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaultCatalogue,
        duplicateReport,
        runDuplicateCheck,
        mergeDuplicates,
        dismissDuplicate,
        qualitySummary,
        runQualityAuditCheck,
        applyQualityFixes,
        createWhatsAppOrderUrl,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
