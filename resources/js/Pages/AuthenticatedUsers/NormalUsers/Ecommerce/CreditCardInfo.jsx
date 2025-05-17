import { useState } from 'react';
import { CreditCard, Calendar, Lock, ChevronLeft, Router } from 'lucide-react';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/NonPrimitive/Footer';

export default function CreditCardPage(props) {
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
  

  const isExpiryValid = (expiry) => {
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2,4})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    let year = parseInt(match[2]);

    // Normalize to 4-digit year if needed
    if (year < 100) {
      year += 2000;
    }

    const now = new Date();
    const expiryDate = new Date(year, month); // the *start* of the next month

    return expiryDate > now;
  };

  const handleSubmit = () => {
    const isAnyFieldEmpty = Object.values(cardInfo).some(value => value.trim() === '');
    if(isAnyFieldEmpty){
      alert('Please Fill All the fields');
    }else if(cardInfo.number.length<16){
      alert("Please enter 16 digits for the card number")
    }else if(!isExpiryValid(cardInfo.expiry)){
      alert("Card is expired")
    }
    else{
      router.post(
        route('market.confirmOrder'),{
          cart:props.Cart,
        }
      )
    }
    console.log('Payment submitted:', cardInfo);
    
  };
  
  const handleCancel = () =>{
    router.post(
      route('market.cancelCredit'),
      {
        cart: props.Cart,
      }
    )
  }
  return (
    <>
    <Head title='Credit Card Info' />
          <AuthenticatedLayout lang={lang}>
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 flex justify-center pt-20">
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
                onClick={handleCancel}
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