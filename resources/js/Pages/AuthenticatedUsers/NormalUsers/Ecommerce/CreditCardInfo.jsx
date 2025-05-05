import { useState } from 'react';
import { CreditCard, Calendar, Lock, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/NonPrimitive/Footer';

export default function CreditCardPage() {
    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s/g, '') // Remove existing spaces
        .replace(/\D/g, '') // Remove non-digits
        .slice(0, 16); // Limit to 16 digits
      
      // Add space every 4 digits
      const formatted = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardInfo({ ...cardInfo, [name]: formatted });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setCardInfo({ ...cardInfo, [name]: formatted });
      return;
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      setCardInfo({ ...cardInfo, [name]: formatted });
      return;
    }

    // For zip code, limit to numbers only
    if (name === 'zipCode') {
      const formatted = value.replace(/\D/g, '').slice(0, 5);
      setCardInfo({ ...cardInfo, [name]: formatted });
      return;
    }
    
    setCardInfo({ ...cardInfo, [name]: value });
  };
  
  const handleSubmit = () => {
    console.log('Payment submitted:', cardInfo);
    alert('Payment submitted successfully!');
  };
  
  return (
    <>
    <Head title='Credit Card Info' />
          <AuthenticatedLayout lang={lang}>
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-100 py-3 px-4 border-b border-green-200">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-green-800">Green Shop Store</div>
          <nav className="flex space-x-6">
            <a href="#" className="text-green-800 text-sm">Shop</a>
            <a href="#" className="text-green-800 text-sm">Cart</a>
            <a href="#" className="text-green-800 text-sm">About Us</a>
            <a href="#" className="text-green-800 text-sm">Chat with Us</a>
            <a href="#" className="text-green-800 text-sm">#plants23</a>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex justify-center p-6 bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex items-center mb-6">
            <button className="text-green-800 mr-4">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold text-green-800 flex items-center">
              <CreditCard className="mr-2" /> Payment Information
            </h2>
          </div>
          
          {/* Card Details Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="card-number">
                Card Number
              </label>
              <div className="relative">
                <input
                  id="card-number"
                  name="number"
                  type="text"
                  value={cardInfo.number}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <CreditCard className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="card-name">
                Cardholder Name
              </label>
              <input
                id="card-name"
                name="name"
                type="text"
                value={cardInfo.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="card-expiry">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    id="card-expiry"
                    name="expiry"
                    type="text"
                    value={cardInfo.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="card-cvv">
                  CVV
                </label>
                <div className="relative">
                  <input
                    id="card-cvv"
                    name="cvv"
                    type="text"
                    value={cardInfo.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <Lock className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
            </div>
            
            {/* Billing Address Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-green-800 mb-4">Billing Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="billing-address">
                    Address
                  </label>
                  <input
                    id="billing-address"
                    name="billingAddress"
                    type="text"
                    value={cardInfo.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={cardInfo.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium" htmlFor="state">
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={cardInfo.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium" htmlFor="zip-code">
                        ZIP
                      </label>
                      <input
                        id="zip-code"
                        name="zipCode"
                        type="text"
                        value={cardInfo.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md flex items-start">
              <Lock className="text-green-600 mr-2 mt-0.5" size={18} />
              <p className="text-sm text-green-700">
                Your payment information is secure. We use 256-bit encryption to protect your data.
              </p>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white font-medium py-3 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <Footer />
          </AuthenticatedLayout>
    </>
  );


    
    
}