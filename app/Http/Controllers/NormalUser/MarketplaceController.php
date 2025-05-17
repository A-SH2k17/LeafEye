<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmation;
use App\Mail\CancelConfirmation;
use App\Models\Order;
use App\Models\Order_Product_Detail;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Monolog\Handler\RedisHandler;

class MarketplaceController extends Controller
{
    //loads the first page that user sees when entering the ecommers
    function viewShops_index(){
        $business = Shop::all();
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/MarketPlace',['shops'=>$business]);
    }


    //loads the products for each shop
    function viewProducts_index($name){
        $shop = Shop::where("name",$name)->first();
        $products = Product::where("shop_id",$shop->id)->where('quantity','>',0)->get();
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/MarketPlaceProduct',['products'=>$products,'shop'=>['name'=>$shop->name,"category"=>$shop->type]]);
    }


    //loads the credit card page
    function creditInfo_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/CreditCardInfo');
    }

    //loads the order success
    function orderSuccess_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/OrderSuccess');
    }

    
    //renders the cart for the user
    function viewCart(Request $request){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/CheckoutDetails',["items"=>$request->chosenItems]);
    }

    //returns to the shop products page from car
    function return(Request $request){
        $shop = Shop::where("id",$request->shopId)->first();
        $products = Product::where("shop_id",$shop->id)->where('quantity','>',0)->get();
        return redirect()->route('market.viewProducts_index',["name"=>$shop->name])->with('Cart',$request->items);
    }


    //handle checkout
    function checkout(Request $request){
        if($request->paymeth == "card"){
            return redirect()->route('market.creditInfo_index')->with('Cart',$request->cart);
        }
        return $this->confirmOrder($request);
    }

    function cancelCredit(Request $request){
        $shop_id = $request->cart[0]['shop_id'];
        $name = Shop::where('id',$shop_id)->first()->name;
        return redirect()->route('market.viewProducts_index',["name"=>$name])->with('Cart',$request->cart);
    }

    function confirmOrder(Request $request){
        $shop = Shop::find($request->cart[0]['shop_id']);
        $owner = User::find($shop->user_id);
        Mail::to(Auth::user()->email)->send(new OrderConfirmation(Auth::user()->first_name,$request->cart,$shop->name,$shop->address,$owner->phone_number));
        $items = $request -> cart;
        try{
            DB::beginTransaction();
            $order = Order::create(["user_id"=>Auth::user()->id,"date_ordered"=>Date::now()]);
            foreach ($items as $item){
                $db_prod = Product::where('id',$item['id'])->first();
                $db_prod->quantity = $db_prod->quantity - $item['selected_quantity'];
                $db_prod->save();
                Order_Product_Detail::create(["order_id"=>$order->id,"product_id"=>$item['id'],"quantity"=>$item["selected_quantity"]]);
            }
            DB::commit();
            return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/OrderSuccess',["Cart"=>$request->cart]);
        }catch(Exception $e){
            DB::rollBack();
            return $e->getMessage();
        }
    }
    
    function cancelOrder(Request $request){
        try {
            DB::beginTransaction();
            

            $shop = Shop::find($request->cart[0]['shop_id']);
            $owner = User::find($shop->user_id);
            // Get the order
            $order = Order::where('user_id', Auth::user()->id)
                         ->latest('date_ordered')
                         ->first();
                         
            if (!$order) {
                throw new Exception('Order not found');
            }
            
            // Get order details
            $orderDetails = Order_Product_Detail::where('order_id', $order->id)->get();
            
            // Restore product quantities
            foreach ($orderDetails as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $product->quantity += $detail->quantity;
                    $product->save();
                }
            }
            
            // Delete order details
            Order_Product_Detail::where('order_id', $order->id)->delete();
            
            // Delete the order
            $order->delete();
            
            // Send cancellation email
            Mail::to(Auth::user()->email)->send(new CancelConfirmation(Auth::user()->first_name,$request->cart,$shop->name,$shop->address,$owner->phone_number));
            
            DB::commit();
            
            // Return to marketplace
            $shop = Shop::find($request->cart[0]['shop_id']);
            return redirect()->route('market.viewProducts_index', ["name" => $shop->name]);
            
        } catch(Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }
}
