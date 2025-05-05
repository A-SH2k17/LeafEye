export default function ProductCard({ product, onAddToCart, inCart }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex">
          <div className="w-1/3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="w-2/3 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
                <p className="text-gray-500 mt-1">{product.price} {product.currency}</p>
                <h3 className="text-xl font-bold">{product.name}</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">{product.description}</p>
            <div className="mt-4 flex justify-end">
              {inCart ? (
                <button 
                  className="bg-green-100 text-green-800 px-4 py-2 rounded font-medium"
                  disabled
                >
                  Added
                </button>
              ) : (
                <button 
                  onClick={onAddToCart}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }