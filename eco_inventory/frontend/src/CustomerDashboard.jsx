import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, MapPin, CheckCircle, AlertCircle, Search, Menu, Filter, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomerDashboard({ isAuthenticated, onRequireAuth }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [purchaseResult, setPurchaseResult] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Mock Customer Location
    const defaultLocation = { lat: 40.650002, lon: -73.949997 };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);

            // Extract Categories
            const cats = ["All", ...new Set(res.data.map(p => p.category))];
            setCategories(cats);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let result = products;

        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(result);
    };

    const handleBuy = async (selectedLocation) => {
        setPurchaseResult(null);

        try {
            const res = await axios.post('/api/purchase', {
                product_id: selectedProduct.id,
                quantity: 1,
                customer_lat: selectedLocation.lat,
                customer_lon: selectedLocation.lon
            });
            setPurchaseResult({
                success: true,
                data: res.data,
                request_location: selectedLocation
            });
        } catch (error) {
            setPurchaseResult({
                success: false,
                message: error.response?.data?.message || "Purchase failed"
            });
        }
    };

    const handleQuickBuyClick = (product) => {
        if (!isAuthenticated) {
            onRequireAuth();
        } else {
            setSelectedProduct(product);
        }
    };

    return (
        <div className="flex flex-col min-h-[80vh]">
            {/* Top Navbar */}
            <div className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button className="md:hidden" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                        <Menu />
                    </button>
                    <h1 className="text-xl font-bold hidden sm:block">DOT.<span className="text-gradient"></span></h1>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/20 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent-primary transition-colors text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-secondary" size={16} />
                </div>

                <div className="flex items-center gap-4">
                    {!isAuthenticated && (
                        <button
                            onClick={onRequireAuth}
                            className="text-sm font-bold text-accent-primary hover:text-white transition-colors border border-accent-primary/20 px-3 py-1.5 rounded-lg hover:bg-accent-primary/10"
                        >
                            Log In / Sign Up
                        </button>
                    )}
                    <button className="relative">
                        <ShoppingCart className="text-white hover:text-accent-primary transition-colors" />
                        <span className="absolute -top-1 -right-1 bg-accent-primary text-xs font-bold text-black rounded-full w-4 h-4 flex items-center justify-center">0</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar Filter */}
                <aside className={`fixed md:sticky md:top-20 h-full w-64 bg-[#0f172a] border-r border-white/10 p-6 transition-transform z-20 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="font-bold">Filters</h2>
                        <button onClick={() => setShowMobileSidebar(false)}><X /></button>
                    </div>

                    <h3 className="text-sm font-bold uppercase text-secondary mb-4 tracking-wider">Categories</h3>
                    <div className="flex flex-col gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-white/10 text-white font-medium' : 'text-secondary hover:bg-white/5'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {loading ? (
                        <div className="text-center py-12">Loading inventory...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onBuy={() => handleQuickBuyClick(product)} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-secondary">
                            No products found matching your criteria.
                        </div>
                    )}
                </main>
            </div>

            {/* Purchase Modal (Quick View) */}
            <AnimatePresence>
                {selectedProduct && (
                    <PurchaseModal
                        product={selectedProduct}
                        onClose={() => { setSelectedProduct(null); setPurchaseResult(null); }}
                        onConfirm={(location) => handleBuy(location)}
                        result={purchaseResult}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ProductCard({ product, onBuy }) {
    return (
        <div className="glass-panel p-4 flex flex-col h-full hover:border-blue-500/50 transition-all group">
            <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder Image Logic based on Category */}
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-center">
                        <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                        <span className="text-xs text-secondary">{product.category}</span>
                    </div>
                )}
                <button onClick={onBuy} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Quick Buy
                </button>
            </div>

            <h3 className="font-bold truncate" title={product.name}>{product.name}</h3>
            <div className="flex items-center gap-2 mb-2">
                {/* Rating placeholder */}
                <div className="flex text-yellow-500 text-xs">★★★★☆</div>
                <span className="text-xs text-secondary">(12)</span>
            </div>

            <div className="mt-auto flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-xs text-red-400">In Stock</span>
                </div>
                <button onClick={onBuy} className="p-2 rounded-full bg-white/10 hover:bg-accent-primary hover:text-black transition-colors">
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    )
}

const SIMULATED_LOCATIONS = [
    { name: "My Current Location (Brooklyn)", lat: 40.650002, lon: -73.949997 },
    { name: "Home (Manhattan - Upper East)", lat: 40.7736, lon: -73.9566 },
    { name: "Office (Jersey City)", lat: 40.7178, lon: -74.0431 },
    { name: "Friend's House (Queens)", lat: 40.7282, lon: -73.7949 },
];

function PurchaseModal({ product, onClose, onConfirm, result }) {
    const [address, setAddress] = useState("");
    const [isGeocoding, setIsGeocoding] = useState(false);

    const handleConfirm = async () => {
        if (!address) return;
        setIsGeocoding(true);

        // Simulate AI Geocoding Delay
        await new Promise(r => setTimeout(r, 800));

        // Keyword-based Geocoding Logic (For Demo Purposes)
        const lowerAddr = address.toLowerCase();
        let lat = 40.7128; // Default NYC
        let lon = -74.0060;

        if (lowerAddr.includes('brooklyn')) { lat = 40.650002; lon = -73.949997; }
        else if (lowerAddr.includes('manhattan') || lowerAddr.includes('ny') || lowerAddr.includes('york')) { lat = 40.7736; lon = -73.9566; }
        else if (lowerAddr.includes('queens')) { lat = 40.7282; lon = -73.7949; }
        else if (lowerAddr.includes('jersey')) { lat = 40.7178; lon = -74.0431; }
        else if (lowerAddr.includes('bronx')) { lat = 40.8448; lon = -73.8648; }

        // Add random jitter so every address feels unique
        lat += (Math.random() - 0.5) * 0.01;
        lon += (Math.random() - 0.5) * 0.01;

        setIsGeocoding(false);
        onConfirm({ name: address, lat, lon });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                className="glass-panel p-0 max-w-lg w-full overflow-hidden bg-[#0f172a]"
                onClick={e => e.stopPropagation()}
            >
                {!result ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold">Checkout</h2>
                        </div>
                        <div className="p-6 flex gap-4">
                            <div className="w-24 h-24 bg-white/5 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ShoppingBag size={40} opacity={0.5} />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-accent-primary font-bold mb-1">${product.price}</p>
                                <p className="text-sm text-secondary mb-4">Sold by DOT. Network</p>

                                {/* Address Input */}
                                <div>
                                    <label className="text-xs uppercase text-secondary font-bold tracking-wider mb-2 block">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-accent-primary" size={16} />
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your full street address..."
                                            className="w-full bg-[#1e293b] border border-white/20 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary min-h-[80px] resize-none"
                                        />
                                    </div>
                                    <p className="text-[10px] text-secondary mt-2 flex items-center gap-1">
                                        <Leaf size={10} className="text-red-400" />
                                        AI analyzes address to minimize carbon footprint.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-[#0f172a] border-t border-white/10 mt-auto flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                            <button
                                onClick={handleConfirm}
                                disabled={!address || isGeocoding}
                                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGeocoding ? 'Analyzing Route...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        {result.success ? (
                            <>
                                <CheckCircle className="mx-auto text-red-400 mb-4" size={48} />
                                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                                <div className="my-6 bg-white/5 p-4 rounded-lg text-left border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-xs uppercase tracking-widest text-secondary mb-1">Delivering To</p>
                                            <p className="font-medium text-white truncate">{result.request_location?.name || "Customer Location"}</p>
                                        </div>
                                        <MapPin className="text-accent-primary shrink-0" size={16} />
                                    </div>

                                    <div className="pt-4 border-t border-dashed border-white/10">
                                        <p className="text-xs uppercase tracking-widest text-secondary mb-2">Optimal Fulfillment Center</p>
                                        <p className="text-lg font-bold mb-1 text-red-400">{result.data.fulfillment_details.store_name}</p>
                                        <p className="text-sm text-secondary mb-1">{result.data.fulfillment_details.reason}</p>
                                        <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded mt-2 border border-red-500/20">
                                            Only {result.data.fulfillment_details.distance_km} km away
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                                <h2 className="text-xl font-bold">Order Failed</h2>
                                <p className="text-secondary mt-2">{result.message}</p>
                            </>
                        )}
                        <button onClick={onClose} className="w-full btn-primary mt-6">Return to Shop</button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

// Helper icon component
function Leaf({ size, className }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg> }
