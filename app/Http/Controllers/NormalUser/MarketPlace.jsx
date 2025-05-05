import { useState } from 'react';
import { Search } from 'lucide-react';

// Main marketplace component
export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample business data - replace with API call to your Laravel backend
  const businesses = [
    {
      id: 1,
      name: "GreenGrow Fertilizers",
      categories: ["Fertilizers", "Seeds"],
      logo: "/agro-logo.png", // You'll need to replace with actual logo path
    },
    {
      id: 2,
      name: "Plant Care Shop",
      categories: ["Soil"],
      logo: "/agro-logo.png",
    },
    {
      id: 3,
      name: "Tools4U",
      categories: ["Planting tools"],
      logo: "/agro-logo.png",
    }
  ];

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AuthenticatedLayout lang={lang}>
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      
      
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
    </AuthenticatedLayout>
  );
}


// Business card component
function BusinessCard({ business }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {/* Replace with actual logo or use an image placeholder */}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <img 
                src="/api/placeholder/64/64" 
                alt={`${business.name} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {business.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="text-sm text-gray-600"
                >
                  {category}
                  {index < business.categories.length - 1 && (
                    <span className="mx-2">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <button className="text-green-600 hover:text-green-700 font-medium">
            View Products
          </button>
        </div>
      </div>
    </div>
  );
}