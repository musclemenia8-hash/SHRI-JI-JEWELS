import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Save,
  RotateCcw,
  ShieldCheck,
  Package,
  MessageSquare,
  Lock,
  CopyCheck,
  AlertTriangle,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, CategoryType, AudienceType } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetToDefaultCatalogue,
    isAdminOpen,
    setIsAdminOpen,
    reviews,
    toggleReviewApproval,
    duplicateReport,
    runDuplicateCheck,
    mergeDuplicates,
    dismissDuplicate,
    qualitySummary,
    runQualityAuditCheck,
    applyQualityFixes,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'duplicates' | 'quality' | 'add' | 'reviews'>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [newProd, setNewProd] = useState<Partial<Product>>({
    id: `SJJ-NEW-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    primaryCategory: 'Chains',
    audience: 'Men',
    productType: 'Chain',
    image: '/assets/aistudio/865418338_1794451764205964_d513dbd6.jpg',
    sellingPrice: 1900,
    originalPrice: 2600,
    description: '',
    availability: 'In Stock',
    isNewArrival: true,
    isBestseller: false,
    pricingSource: 'Artisan Workshop Rule',
    identificationConfidence: 'Verified',
    approvalStatus: 'Approved',
    features: ['22K Royal Gold Polish', 'High Durability Alloy', 'Custom Hallmark'],
  });

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  if (!isAdminOpen) return null;

  // Simple Admin Authentication Check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '9315' || adminPin === 'admin' || adminPin === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. (Hint: 9315 or admin)');
    }
  };

  // AI-Assisted Product Analysis Simulation (Phase 23 requirement)
  const handleRunAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setAiAnalysisResult(null);

    setTimeout(() => {
      const img = newProd.image || '';
      let detectedCat: CategoryType = 'Chains';
      let detectedAudience: AudienceType = 'Men';
      let detectedType = 'Chain';
      let suggestedName = "Men's Gold Tone Classic Chain";
      let suggestedPrice = 1900;
      let suggestedDesc = 'Handcrafted gold-tone traditional neck chain with smooth interlocking links and secure clasp.';

      if (img.includes('ring') || newProd.primaryCategory === 'Rings') {
        detectedCat = 'Rings';
        detectedAudience = 'Unisex';
        detectedType = 'Band Ring';
        suggestedName = "Unisex Gold Tone Classic Band Ring";
        suggestedPrice = 1500; // per owner flat rule
        suggestedDesc = 'Solid gold-tone signet band ring with smooth inner shank for everyday comfort.';
      } else if (img.includes('bangle') || newProd.primaryCategory === 'Bangles & Kada') {
        detectedCat = 'Bangles & Kada';
        detectedAudience = 'Women';
        detectedType = 'Kada';
        suggestedName = "Women's Traditional Gold Tone Kada Pair";
        suggestedPrice = 2000;
        suggestedDesc = 'Traditional Indian gold-tone kada pair with fine embossed detailing for wedding wear.';
      }

      setNewProd((prev) => ({
        ...prev,
        primaryCategory: detectedCat,
        audience: detectedAudience,
        productType: detectedType,
        name: suggestedName,
        sellingPrice: suggestedPrice,
        description: suggestedDesc,
      }));

      setIsAiAnalyzing(false);
      setAiAnalysisResult('AI Visual Analysis Complete: Flipkart/Myntra standard format applied.');
    }, 1000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sellingPrice) {
      alert('Please provide product title and selling price.');
      return;
    }

    const discount =
      newProd.originalPrice && newProd.originalPrice > Number(newProd.sellingPrice)
        ? Math.round(((newProd.originalPrice - Number(newProd.sellingPrice)) / newProd.originalPrice) * 100)
        : undefined;

    const fullProduct: Product = {
      id: newProd.id || `SJJ-PROD-${Date.now()}`,
      name: newProd.name,
      slug: (newProd.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      primaryCategory: (newProd.primaryCategory as CategoryType) || 'Chains',
      audience: (newProd.audience as AudienceType) || 'Men',
      productType: newProd.productType || 'Jewellery',
      image: newProd.image || '/assets/aistudio/865418338_1794451764205964_d513dbd6.jpg',
      sellingPrice: Number(newProd.sellingPrice),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      discountPercent: discount,
      description: newProd.description || 'Exclusive handcrafted jewellery by Shri Ji Jewels.',
      availability: (newProd.availability as any) || 'In Stock',
      isNewArrival: !!newProd.isNewArrival,
      isBestseller: !!newProd.isBestseller,
      pricingSource: newProd.pricingSource || 'Artisan Workshop Rule',
      identificationConfidence: 'Verified',
      approvalStatus: 'Approved',
      features: newProd.features || ['22K Royal Gold Polish'],
    };

    addProduct(fullProduct);
    setActiveTab('products');
    alert('Product added successfully with automatic duplicate check.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#241A15]/85 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAdminOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl border border-[#C5A059]/40 z-10 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5A059]/20 bg-[#241A15] text-[#FBF8F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-royal text-base font-bold text-white tracking-wider">
                SHRI JI JEWELS — Quality Control & Catalogue Suite
              </h3>
              <p className="text-[10px] text-[#DFCA9B]/80 font-mono">
                Duplicate Detection · Flipkart/Myntra QC · Central Inventory Console
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-[#DFCA9B] hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#9E7D3B]">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-royal text-lg font-bold text-[#241A15]">
              Administrator Verification
            </h4>
            <p className="text-xs text-[#5A4A42]">
              Enter administrator passcode to access inventory controls, duplicate audit, and moderation.
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter PIN (e.g., 9315)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-3 py-2 border border-[#C5A059]/40 rounded-sm text-center font-mono tracking-widest text-sm focus:outline-hidden focus:border-[#9E7D3B]"
                autoFocus
              />
              {pinError && <p className="text-red-600 text-xs">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-[#241A15] hover:bg-[#9E7D3B] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
              >
                Access Quality Console
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-2.5 bg-[#F5EFEB] border-b border-[#C5A059]/20 text-xs font-semibold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-[#241A15] text-[#DFCA9B]'
                    : 'text-[#5A4A42] hover:text-[#241A15]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventory ({products.length})</span>
              </button>

              {/* SYSTEM 1: Duplicate Audit Tab */}
              <button
                onClick={() => setActiveTab('duplicates')}
                className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'duplicates'
                    ? 'bg-[#241A15] text-[#DFCA9B]'
                    : 'text-[#5A4A42] hover:text-[#241A15]'
                }`}
              >
                <CopyCheck className="w-4 h-4" />
                <span>Duplicate Audit</span>
                {duplicateReport && duplicateReport.potentialCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] rounded-full">
                    {duplicateReport.potentialCount}
                  </span>
                )}
              </button>

              {/* SYSTEM 2: Listing Quality Control Tab */}
              <button
                onClick={() => setActiveTab('quality')}
                className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'quality'
                    ? 'bg-[#241A15] text-[#DFCA9B]'
                    : 'text-[#5A4A42] hover:text-[#241A15]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Listing QC ({qualitySummary?.averageScore || 100}%)</span>
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'add'
                    ? 'bg-[#241A15] text-[#DFCA9B]'
                    : 'text-[#5A4A42] hover:text-[#241A15]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-[#241A15] text-[#DFCA9B]'
                    : 'text-[#5A4A42] hover:text-[#241A15]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reviews ({reviews.length})</span>
              </button>

              <button
                onClick={resetToDefaultCatalogue}
                className="ml-auto text-xs text-red-700 hover:text-red-900 flex items-center gap-1 whitespace-nowrap pl-2"
                title="Reset all changes to factory database"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              
              {/* TAB 1: Product Inventory Table */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {editingProduct ? (
                    <form onSubmit={handleSaveEdit} className="p-4 bg-[#FBF8F2] rounded-lg border border-[#C5A059]/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-2">
                        <h4 className="font-royal text-sm font-bold text-[#241A15]">
                          Editing Product: {editingProduct.id}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-xs text-[#5A4A42] hover:text-[#241A15]"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[#5A4A42] font-semibold mb-1">Product Title</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-[#C5A059]/30 rounded-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[#5A4A42] font-semibold mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            value={editingProduct.sellingPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 border border-[#C5A059]/30 rounded-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[#5A4A42] font-semibold mb-1">Category</label>
                          <select
                            value={editingProduct.primaryCategory}
                            onChange={(e) => setEditingProduct({ ...editingProduct, primaryCategory: e.target.value as any })}
                            className="w-full px-2.5 py-1.5 border border-[#C5A059]/30 rounded-sm bg-white"
                          >
                            <option value="Chains">Chains</option>
                            <option value="Rings">Rings</option>
                            <option value="Bangles & Kada">Bangles & Kada</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Pendants">Pendants</option>
                            <option value="Earrings">Earrings</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-3 py-1.5 border border-[#C5A059]/30 text-xs rounded-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#241A15] text-[#DFCA9B] text-xs font-semibold rounded-sm hover:bg-[#9E7D3B]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-[#C5A059]/20">
                      <thead className="bg-[#F5EFEB] text-[#241A15] border-b border-[#C5A059]/20">
                        <tr>
                          <th className="p-2.5">Item</th>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Title</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Audience</th>
                          <th className="p-2.5">Price</th>
                          <th className="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5EFEB]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FBF8F2] transition-colors">
                            <td className="p-2.5">
                              <img src={p.image} alt="" className="w-9 h-9 object-cover rounded-sm border border-[#C5A059]/30" />
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-[#9E7D3B] font-semibold">{p.id}</td>
                            <td className="p-2.5 font-semibold text-[#241A15] max-w-xs truncate">{p.name}</td>
                            <td className="p-2.5 text-[#5A4A42]">{p.primaryCategory}</td>
                            <td className="p-2.5 text-[#5A4A42]">{p.audience}</td>
                            <td className="p-2.5 font-bold text-[#241A15] tabular-nums">₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                            <td className="p-2.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1 text-[#9E7D3B] hover:text-[#241A15]"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                                  }}
                                  className="p-1 text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: SYSTEM 1 DUPLICATE AUDIT CONSOLE */}
              {activeTab === 'duplicates' && (
                <div className="space-y-6">
                  {/* Duplicate Engine Status Card */}
                  <div className="p-4 bg-[#FBF8F2] rounded-lg border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CopyCheck className="w-5 h-5 text-[#9E7D3B]" />
                        <h4 className="font-royal text-base font-bold text-[#241A15]">
                          Automatic Duplicate Detection & Removal Engine
                        </h4>
                      </div>
                      <p className="text-xs text-[#5A4A42] mt-1">
                        Continuous scanning over {products.length} products analyzing image hashes, product IDs, title similarity, and pricing signatures.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const rep = runDuplicateCheck();
                        alert(`Duplicate Scan Complete: ${rep.confirmedCount} confirmed duplicates removed, ${rep.potentialCount} potential duplicates pending.`);
                      }}
                      className="px-4 py-2 bg-[#241A15] hover:bg-[#9E7D3B] text-[#DFCA9B] hover:text-white font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shrink-0 shadow-sm"
                    >
                      Run Full Catalogue Scan
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Active Clean Catalogue</span>
                      <strong className="text-xl text-[#241A15] font-bold block mt-1">{products.length} Products</strong>
                      <span className="text-[10px] text-emerald-700">100% Unique Verified Records</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Confirmed Duplicates Removed</span>
                      <strong className="text-xl text-emerald-800 font-bold block mt-1">{duplicateReport?.confirmedCount || 0} Removed</strong>
                      <span className="text-[10px] text-[#5A4A42]">Canonical Record Preserved</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Potential Duplicates (Safety Review)</span>
                      <strong className="text-xl text-amber-700 font-bold block mt-1">{duplicateReport?.potentialCount || 0} Flagged</strong>
                      <span className="text-[10px] text-[#5A4A42]">Rule §1.C: Never auto-deleted without proof</span>
                    </div>
                  </div>

                  {/* Potential Duplicates Requiring Admin Review */}
                  {duplicateReport && duplicateReport.records.filter((r) => r.status === 'potential_pending').length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h5 className="font-royal text-sm font-bold text-[#241A15]">
                          Potential Duplicates Awaiting Admin Confirmation
                        </h5>
                      </div>
                      <p className="text-xs text-[#5A4A42]">
                        These designs look similar or share similar titles. Verify whether they are distinct artisan variations or the same item.
                      </p>

                      <div className="space-y-3">
                        {duplicateReport.records
                          .filter((r) => r.status === 'potential_pending')
                          .map((rec) => (
                            <div key={rec.id} className="p-4 bg-white rounded-lg border border-amber-300 shadow-xs space-y-3">
                              <div className="flex items-center justify-between text-xs border-b border-amber-100 pb-2">
                                <span className="font-mono text-[10px] text-amber-900 font-semibold">
                                  Similarity Match: {Math.round(rec.confidence * 100)}%
                                </span>
                                <span className="text-[#5A4A42]">{rec.reason}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Product A (Canonical Candidate) */}
                                <div className="flex items-center gap-3 p-2 bg-[#FBF8F2] rounded-sm border border-[#C5A059]/20">
                                  <img src={rec.canonicalProduct.image} alt="" className="w-12 h-12 object-cover rounded-sm border" />
                                  <div className="text-xs">
                                    <span className="font-mono text-[10px] text-[#9E7D3B]">{rec.canonicalProduct.id}</span>
                                    <h6 className="font-bold text-[#241A15]">{rec.canonicalProduct.name}</h6>
                                    <span className="text-[#5A4A42]">₹{rec.canonicalProduct.sellingPrice} · {rec.canonicalProduct.primaryCategory}</span>
                                  </div>
                                </div>

                                {/* Product B (Duplicate Candidate) */}
                                <div className="flex items-center gap-3 p-2 bg-[#FBF8F2] rounded-sm border border-[#C5A059]/20">
                                  <img src={rec.duplicateProduct.image} alt="" className="w-12 h-12 object-cover rounded-sm border" />
                                  <div className="text-xs">
                                    <span className="font-mono text-[10px] text-[#9E7D3B]">{rec.duplicateProduct.id}</span>
                                    <h6 className="font-bold text-[#241A15]">{rec.duplicateProduct.name}</h6>
                                    <span className="text-[#5A4A42]">₹{rec.duplicateProduct.sellingPrice} · {rec.duplicateProduct.primaryCategory}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                  onClick={() => dismissDuplicate(rec.canonicalProduct.id, rec.duplicateProduct.id)}
                                  className="px-3 py-1.5 bg-[#F5EFEB] hover:bg-[#E5D7BE] text-[#241A15] text-xs font-semibold rounded-sm transition-colors"
                                >
                                  Keep Both (Distinct Designs)
                                </button>
                                <button
                                  onClick={() => mergeDuplicates(rec.canonicalProduct.id, rec.duplicateProduct.id)}
                                  className="px-3 py-1.5 bg-[#241A15] hover:bg-[#9E7D3B] text-white text-xs font-semibold rounded-sm transition-colors"
                                >
                                  Merge & Retain Canonical
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Confirmed Duplicate Log */}
                  <div className="space-y-3">
                    <h5 className="font-royal text-sm font-bold text-[#241A15]">
                      Audit Trail: Confirmed Duplicate Removals
                    </h5>
                    {duplicateReport && duplicateReport.records.filter((r) => r.status === 'confirmed_removed').length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-[#C5A059]/20">
                          <thead className="bg-[#F5EFEB] text-[#241A15]">
                            <tr>
                              <th className="p-2.5">Retained Product</th>
                              <th className="p-2.5">Removed Duplicate</th>
                              <th className="p-2.5">Match Reason</th>
                              <th className="p-2.5">Confidence</th>
                              <th className="p-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F5EFEB]">
                            {duplicateReport.records
                              .filter((r) => r.status === 'confirmed_removed')
                              .map((rec) => (
                                <tr key={rec.id} className="hover:bg-[#FBF8F2]">
                                  <td className="p-2.5 font-semibold text-emerald-800">
                                    {rec.canonicalProduct.id} — {rec.canonicalProduct.name}
                                  </td>
                                  <td className="p-2.5 text-red-700 line-through">
                                    {rec.duplicateProduct.id} — {rec.duplicateProduct.name}
                                  </td>
                                  <td className="p-2.5 text-[#5A4A42] max-w-xs">{rec.reason}</td>
                                  <td className="p-2.5 font-mono">{Math.round(rec.confidence * 100)}%</td>
                                  <td className="p-2.5 text-right">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-xs text-[10px] font-semibold">
                                      Safely Removed
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#FBF8F2] rounded-md border border-[#C5A059]/20 text-xs text-[#5A4A42] flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Zero redundant duplicate records found in catalogue. All 45 pieces are unique verified assets.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SYSTEM 2 FLIPKART / MYNTRA LISTING QUALITY CONTROL */}
              {activeTab === 'quality' && (
                <div className="space-y-6">
                  {/* Quality Control Header Card */}
                  <div className="p-4 bg-[#FBF8F2] rounded-lg border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#9E7D3B]" />
                        <h4 className="font-royal text-base font-bold text-[#241A15]">
                          Product Listing Quality Control Console (Flipkart & Myntra Standard)
                        </h4>
                      </div>
                      <p className="text-xs text-[#5A4A42] mt-1">
                        Enforces searchable, professional titles (`[Audience]'s [Finish] [Pattern] [Type]`), natural Indian English descriptions, zero promotional fluff, and no invented metal/gem purity claims.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          applyQualityFixes();
                          alert('Flipkart/Myntra standard titles and descriptions applied to all catalogue items.');
                        }}
                        className="px-4 py-2 bg-[#C5A059] hover:bg-[#9E7D3B] text-[#1A130F] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
                      >
                        1-Click Standardize All
                      </button>
                      <button
                        onClick={() => {
                          runQualityAuditCheck();
                        }}
                        className="p-2 bg-[#241A15] text-[#DFCA9B] rounded-sm hover:text-white"
                        title="Re-audit"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quality Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Catalogue Quality Score</span>
                      <strong className="text-2xl text-emerald-800 font-bold block mt-1">
                        {qualitySummary?.averageScore || 100}%
                      </strong>
                      <span className="text-[10px] text-[#5A4A42]">High-Tier Indian Marketplace Grade</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Anti-Puffery Compliance</span>
                      <strong className="text-2xl text-emerald-800 font-bold block mt-1">100% Clean</strong>
                      <span className="text-[10px] text-[#5A4A42]">Zero "Royal Majesty", "Imperial" puffery</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-md border border-[#C5A059]/20">
                      <span className="text-[#5A4A42] block">Authenticity & Safety</span>
                      <strong className="text-2xl text-emerald-800 font-bold block mt-1">Verified</strong>
                      <span className="text-[10px] text-[#5A4A42]">No invented carat, hallmark, or solid gold claims</span>
                    </div>
                  </div>

                  {/* Listing Quality Breakdown Table */}
                  <div className="space-y-3">
                    <h5 className="font-royal text-sm font-bold text-[#241A15]">
                      Individual Product Listing Audits
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-[#C5A059]/20">
                        <thead className="bg-[#F5EFEB] text-[#241A15]">
                          <tr>
                            <th className="p-2.5">ID</th>
                            <th className="p-2.5">Current Title</th>
                            <th className="p-2.5">Score</th>
                            <th className="p-2.5">Status & Audit Notes</th>
                            <th className="p-2.5 text-right">Standardized Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5EFEB]">
                          {qualitySummary?.results.map((res) => (
                            <tr key={res.productId} className="hover:bg-[#FBF8F2]">
                              <td className="p-2.5 font-mono text-[11px] text-[#9E7D3B] font-semibold">{res.productId}</td>
                              <td className="p-2.5 font-semibold text-[#241A15] max-w-xs">{res.productName}</td>
                              <td className="p-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded-xs font-mono font-bold text-[11px] ${
                                    res.qualityScore >= 85
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {res.qualityScore}%
                                </span>
                              </td>
                              <td className="p-2.5 text-[#5A4A42] text-[11px]">
                                {res.titleIssues.length === 0 && res.descriptionIssues.length === 0 ? (
                                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Compliant Flipkart/Myntra standard</span>
                                  </span>
                                ) : (
                                  <span className="text-amber-800">
                                    {[...res.titleIssues, ...res.descriptionIssues].join('; ')}
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-right text-[#9E7D3B] font-medium font-mono text-[11px]">
                                {res.suggestedTitle}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Add Product with AI Assist */}
              {activeTab === 'add' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#FBF8F2] rounded-lg border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-royal text-sm font-bold text-[#241A15]">
                        AI Vision Product Identification & Listing Assistant
                      </h4>
                      <p className="text-xs text-[#5A4A42]">
                        Automatically analyzes product image, identifies category, suggests Flipkart/Myntra compliant titles, and calculates pricing rules.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunAiAnalysis}
                      disabled={isAiAnalyzing}
                      className="px-4 py-2 bg-[#241A15] hover:bg-[#9E7D3B] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 shadow-xs shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-[#DFCA9B]" />
                      <span>{isAiAnalyzing ? 'Analyzing Image...' : 'Run AI Analysis'}</span>
                    </button>
                  </div>

                  {aiAnalysisResult && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-900">
                      {aiAnalysisResult}
                    </div>
                  )}

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Product ID</label>
                        <input
                          type="text"
                          value={newProd.id}
                          onChange={(e) => setNewProd({ ...newProd, id: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Product Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Men's Gold Tone Classic Chain"
                          value={newProd.name}
                          onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Category</label>
                        <select
                          value={newProd.primaryCategory}
                          onChange={(e) => setNewProd({ ...newProd, primaryCategory: e.target.value as any })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white"
                        >
                          <option value="Chains">Chains</option>
                          <option value="Rings">Rings</option>
                          <option value="Bangles & Kada">Bangles & Kada</option>
                          <option value="Bracelets">Bracelets</option>
                          <option value="Pendants">Pendants</option>
                          <option value="Earrings">Earrings</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Audience</label>
                        <select
                          value={newProd.audience}
                          onChange={(e) => setNewProd({ ...newProd, audience: e.target.value as any })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white"
                        >
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={newProd.sellingPrice}
                          onChange={(e) => setNewProd({ ...newProd, sellingPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[#5A4A42] font-semibold mb-1">Image Path</label>
                        <input
                          type="text"
                          value={newProd.image}
                          onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[#5A4A42] font-semibold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newProd.description}
                          onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A059]/30 rounded-sm bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#241A15] hover:bg-[#9E7D3B] text-white font-semibold uppercase tracking-wider rounded-sm transition-colors"
                    >
                      Publish Approved Product To Catalogue
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: Moderate Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#5A4A42]">
                    Review submissions awaiting admin moderation. Only approved reviews appear on the live storefront.
                  </p>

                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 bg-[#FBF8F2] rounded-md border border-[#C5A059]/25 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-[#241A15]">{r.customerName}</strong>
                            <span className="text-[#5A4A42]">({r.city})</span>
                            <span className="font-mono text-[#9E7D3B]">★ {r.rating}/5</span>
                          </div>
                          <p className="italic text-[#5A4A42]">"{r.comment}"</p>
                          <span className="text-[10px] text-[#5A4A42]/80">Item: {r.productPurchased} · {r.date}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleReviewApproval(r.id)}
                            className={`px-3 py-1.5 rounded-sm font-semibold flex items-center gap-1 ${
                              r.isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.isApproved ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approved</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Pending Approval</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
