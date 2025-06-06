<?php

namespace App\Http\Controllers\BusinessUser;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Order_Product_Detail;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // Get the shop owned by the authenticated business user
        $shop = Shop::where('user_id', Auth::id())->first();
        
        if (!$shop) {
            return redirect()->back()->with('error', 'No shop found for this business account');
        }

        // Get all products from this shop
        $shopProducts = Product::where('shop_id', $shop->id)->pluck('id');

        // Get all order details for these products
        $orderDetails = Order_Product_Detail::whereIn('product_id', $shopProducts)
            ->with(['order.user', 'product'])
            ->get()
            ->groupBy('order_id');

        // Format the orders with user details and product information
        $orders = [];
        foreach ($orderDetails as $orderId => $details) {
            $order = $details->first()->order;
            $user = $order->user;
            
            $orders[] = [
                'id' => $order->id,
                'date_ordered' => $order->date_ordered,
                'status' => $order->status ?? 'pending',
                'user' => [
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                    'address' => $user->location
                ],
                'products' => $details->map(function ($detail) {
                    return [
                        'name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->product->price
                    ];
                })
            ];
        }

        return Inertia::render('AuthenticatedUsers/BusinessOwners/ViewOrders', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:completed,pending'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully');
    }

    public function apiIndex()
    {
        // Get the shop owned by the authenticated business user
        $shop = Shop::where('user_id', Auth::id())->first();
        
        if (!$shop) {
            return response()->json([
                'error' => 'No shop found for this business account'
            ], 404);
        }

        // Get all products from this shop
        $shopProducts = Product::where('shop_id', $shop->id)->pluck('id');

        // Get all order details for these products
        $orderDetails = Order_Product_Detail::whereIn('product_id', $shopProducts)
            ->with(['order.user', 'product'])
            ->get()
            ->groupBy('order_id');

        // Format the orders with user details and product information
        $orders = [];
        foreach ($orderDetails as $orderId => $details) {
            $order = $details->first()->order;
            $user = $order->user;
            
            $orders[] = [
                'id' => $order->id,
                'date_ordered' => $order->date_ordered,
                'status' => $order->status ?? 'pending',
                'user' => [
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                    'address' => $user->location
                ],
                'products' => $details->map(function ($detail) {
                    return [
                        'name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->product->price
                    ];
                })
            ];
        }

        return response()->json([
            'orders' => $orders
        ]);
    }

    public function apiUpdateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:completed,pending'
        ]);

        // Verify that the order belongs to the business user's shop
        $shop = Shop::where('user_id', Auth::id())->first();
        if (!$shop) {
            return response()->json([
                'error' => 'No shop found for this business account'
            ], 404);
        }

        $shopProducts = Product::where('shop_id', $shop->id)->pluck('id');
        $orderBelongsToShop = Order_Product_Detail::where('order_id', $order->id)
            ->whereIn('product_id', $shopProducts)
            ->exists();

        if (!$orderBelongsToShop) {
            return response()->json([
                'error' => 'Order not found or does not belong to your shop'
            ], 404);
        }

        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => [
                'id' => $order->id,
                'status' => $order->status
            ]
        ]);
    }
} 