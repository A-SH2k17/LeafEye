import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/Components/NonPrimitive/ProductCard';
import CartReview from '@/Components/NonPrimitive/CartReview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import Footer from '@/Components/NonPrimitive/Footer';

export default function PlantCareShop(props) {
    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

  const [cartItems, setCartItems] = useState(props.Cart || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const products = props.products;

  // Filter and sort products whenever search query or sort option changes
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          ? { ...item, selected_quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, selected_quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else{
      setCartItems(cartItems.map(item => 
        item.id === productId 
          ? newQuantity<=item.quantity?{ ...item, selected_quantity: newQuantity } :item
          : item
      ));
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.selected_quantity, 0);

  return (
    <>
    <Head title='Market Products' />
          <AuthenticatedLayout lang={lang}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 mt-20">
          <h1 className="text-3xl font-bold text-gray-800">{props.shop.name}</h1>
          <p className="text-lg text-gray-600">{props.shop.category}</p>
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
     <Footer />
    </AuthenticatedLayout>

    </>
    
  );
}


