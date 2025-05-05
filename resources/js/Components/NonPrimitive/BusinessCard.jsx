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
                    alt={`${business.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-green-200 rounded-full">
                    <span className="text-green-700 font-semibold text-lg">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {business.categories.map((category, index) => (
                  <span 
                    key={category.id || index} 
                    className="text-sm text-gray-600"
                  >
                    {category.name || category}
                    {index < business.categories.length - 1 && (
                      <span className="mx-2">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <a 
              href={`/businesses/${business.id}/products`} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View Products
            </a>
          </div>
        </div>
      </div>
    );
  }