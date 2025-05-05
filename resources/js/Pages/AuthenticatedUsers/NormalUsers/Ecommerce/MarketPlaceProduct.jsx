import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/Components/NonPrimitive/ProductCard';
import CartReview from '@/Components/NonPrimitive/CartReview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import Footer from '@/Components/NonPrimitive/Footer';

export default function PlantCareShop() {
    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const products = [
    {
      id: 1,
      name: 'Garden Soil',
      price: 50,
      currency: 'EGP',
      image: '/api/placeholder/150/150',
      description: "Grow delicious, juicy tomatoes with our high-quality seeds, perfect for home gardens and farms. These seeds are selected for their high yield, disease resistance, and adaptability to various climates. Whether you're a beginner or an expert farmer, enjoy healthy, vibrant tomato plants with a rich flavor. Order now and start your journey to a bountiful harvest! 🍅",
      category: 'Soil'
    },
    {
      id: 2,
      name: 'Dirt Bag',
      price: 50,
      currency: 'EGP',
      image: '/api/placeholder/150/150',
      description: 'Premium soil mix perfect for indoor and outdoor plants. Rich in nutrients and ideal for most garden applications.',
      category: 'Soil'
    },
    {
      id: 3,
      name: 'Tomato Seeds',
      price: 35,
      currency: 'EGP',
      image: '/api/placeholder/150/150',
      description: 'Heirloom tomato seeds that produce juicy, flavorful tomatoes. Easy to grow and perfect for beginners.',
      category: 'Seeds'
    },
    {
      id: 4,
      name: 'Organic Fertilizer',
      price: 75,
      currency: 'EGP',
      image: '/api/placeholder/150/150',
      description: 'All-natural organic fertilizer that promotes healthy growth without harmful chemicals. Suitable for all plants.',
      category: 'Fertilizer'
    }
  ];

  // Filter and sort products whenever search query or sort option changes
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [searchQuery, sortOption]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
    <Head title='Market Products' />
          <AuthenticatedLayout lang={lang}>

    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-green-600 font-bold text-xl">LEAF-EYE</span>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-green-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Feed</a>
            <a href="#" className="text-gray-700 hover:text-green-600">MarketPlace</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Chat with LeafEye</a>
            <a href="#" className="text-gray-700 hover:text-green-600">afshana57</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Plant Care Shop</h1>
          <p className="text-lg text-gray-600">Seeds and Fertilizers</p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6">
          {/* Products Column */}
          <div className="w-full md:w-2/3 space-y-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => addToCart(product)}
                  inCart={cartItems.some(item => item.id === product.id)}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </div>

          {/* Cart Column */}
          <div className="w-full md:w-1/3">
            <CartReview 
              items={cartItems} 
              updateQuantity={updateQuantity}
              totalItems={totalItems}
            />
          </div>
        </div>
      </main>
    </div>
     <Footer />
    </AuthenticatedLayout>

    </>
    
  );
}


