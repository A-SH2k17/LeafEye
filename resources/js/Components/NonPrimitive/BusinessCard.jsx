// This is a standalone BusinessCard component that can be imported into your Marketplace component
// File: resources/js/Components/BusinessCard.jsx

export default function BusinessCard({ business }) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                {business.logo ? (
                  <img 
                    src={business.logo}
                    className="object-contain"
                  />
                ) : (
                   <img 
                    src="/images/tempStLogo.png"
                    className="object-contain"
                  />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                  <span 
                    className="text-sm text-gray-600"
                  >
                    {business.type}
                  </span>
              </div>
            </div>
          </div>
          <div>
            <a 
              href={`/market/${business.name}/products`} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View Products
            </a>
          </div>
        </div>
      </div>
    );
  }