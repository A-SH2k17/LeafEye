import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import Footer from '@/Components/NonPrimitive/Footer';

export default function ShoppingCart() {
     //multilangiage code
     const {lang,handleChange,languages} = useLanguage();
     const {t} = useTranslation();

  const [items, setItems] = useState([
    { id: 1, name: 'Tomato Seeds', price: 150, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 2, name: 'Pruning Shears', price: 350, quantity: 1, image: '/api/placeholder/60/60' }
  ]);
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const handleQuantityChange = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };
  
  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <>
    <Head title='Market Products' />
              <AuthenticatedLayout lang={lang}>
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-100 py-3 px-4 border-b border-green-200">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-green-800">LeafEye</div>
          <nav className="flex space-x-6">
            <a href="#" className="text-green-800 text-sm">Home</a>
            <a href="#" className="text-green-800 text-sm">Feed</a>
            <a href="#" className="text-green-800 text-sm">NutriPlus</a>
            <a href="#" className="text-green-800 text-sm">Chat with LeafEye</a>
            <a href="#" className="text-green-800 text-sm">#leafeye32</a>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Cart</h1>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-md p-4 flex items-center shadow-sm">
              <div className="flex items-center flex-1">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-green-800">{item.name}</h3>
                  <p className="text-gray-600">{item.price} EGP</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center border rounded-md mr-4">
                  <button 
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="px-3 py-1 text-gray-600"
                  >
                    −
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="px-3 py-1 text-gray-600"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{subtotal} EGP</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{subtotal} EGP</span>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mr-2"
              />
              <span>Cash on Delivery</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-2"
              />
              <span>Credit/Debit Card</span>
            </label>
            
            
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between">
          <button className="flex items-center text-green-800 font-medium">
            <ChevronLeft size={20} />
            <span>Back to Shop</span>
          </button>
          
          <button className="bg-green-700 text-white px-6 py-2 rounded-md font-medium">
            Confirm Order
          </button>
        </div>
      </main>
    </div>
    <Footer />
    </AuthenticatedLayout>
    </>
  );
 
   
    
}