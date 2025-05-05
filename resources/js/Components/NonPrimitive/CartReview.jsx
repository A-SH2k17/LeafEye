import { ShoppingCart } from 'lucide-react';
export default function CartReview({ items, updateQuantity, totalItems }) {
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
        <h2 className="text-xl font-bold mb-4">Cart Review</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <p className="mb-4">{totalItems} {totalItems === 1 ? 'item' : 'items'} added to Cart</p>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{item.name}</span>
                    <span>{item.price} {item.currency}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">Qty:</span>
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 py-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{cartTotal} EGP</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center">
                <ShoppingCart size={18} className="mr-2" />
                View Cart
              </button>
            </div>
          </>
        )}
      </div>
    );
  }