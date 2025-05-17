import { useState } from 'react';
import { Search } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import Footer from '@/Components/NonPrimitive/Footer';
import BusinessCard from '@/Components/NonPrimitive/BusinessCard';
// Main marketplace component
export default function Marketplace(props) {
  const [searchQuery, setSearchQuery] = useState('');
   //multilangiage code
      const {lang,handleChange,languages} = useLanguage();
      const {t} = useTranslation();
  
  // Sample business data - replace with API call to your Laravel backend
  const businesses = props.shops;

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head title='Market' />
      <AuthenticatedLayout lang={lang}>
        <div className="flex flex-col min-h-screen">
          
          
          
          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>
            
            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search for business"
                className="w-full p-3 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Business Listings */}
            <div className="space-y-4">
              {filteredBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </main>
        </div>

        <Footer />
      </AuthenticatedLayout>
    </>
  );
}


