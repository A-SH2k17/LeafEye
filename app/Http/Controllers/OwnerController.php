<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Shop;
use Exception;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use function Pest\Laravel\json;

class OwnerController extends Controller
{

    //function to render the business owner home page
    function index(){
        return Inertia::render('AuthenticatedUsers/BusinessOwners/Dashboard');
    }

    
    function showAddProduct(){
        return Inertia::render('AuthenticatedUsers/BusinessOwners/AddProduct');
    }

    function showEditItem($name){
        $product = Product::where('name',$name)->first();
        return Inertia::render('AuthenticatedUsers/BusinessOwners/EditProduct',['product'=>$product]);
    }

    function addProduct(Request $request){
        try{
            //return $request;
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0.01',
                'image' => 'required|image|max:2048',
                'Description' => 'required|string',
                'shop_id'=>'required|exists:shops,id'
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $check = Product::where('name',$request->product_name)->first();
            if($check){
                return redirect()->route('business.dashboard')->withErrors(["message"=>"Error:Product already added, cannot add the same product twice"]);
            }

            $imagePath = null;
                if ($request->hasFile('image')) {
                    $imagePath = $request->file('image')->store("product_images/{$request->shop_id}", 'public');
                }

            Product::create([
                "name"=>$request->product_name,
                "image_path"=>$imagePath,
                "price"=>$request->price,
                "shop_id"=>$request->shop_id,
                "quantity"=>$request->quantity,
                "description"=>$request->Description,
            ]);
            return redirect()->route("business.dashboard")->with("success","Product Added Succesfully");
        }catch(Exception $e){
            return back()->with("error",$e->getMessage());
        }
    }

    function updateQuantity(Request $request){
        try{
            if(Product::where('id',$request->id)->first()->quantity == $request->quantity){
                return response()->json(["error"=>"Please Change Quantity To Update"]);
            }
            Product::where('id',$request->id)->update(['quantity'=>$request->quantity]);
            return response()->json(["success"=>"Updated Successfully"]);
        }catch(Exception $e){
            return response()->json(["error"=>$e->getMessage()],500);
        }
    }


    function deleteItem($id){
        try{
            $product = Product::where('id',$id)->first();
            $product->delete();

            $userShop = Shop::where('user_id', Auth::id())->first();
            $products_db = Product::where('shop_id', $userShop->id)->get();
            
            $products = [];
            foreach ($products_db as $product) {
                array_push($products, [
                    'id'=>$product->id,
                    'name' => $product->name,
                    'quantity' => $product->quantity,
                    'price' => $product->price,
                    'image_path' => $product->image_path,
                ]);
            }


            return response()->json(["message"=>"Deleted Successfully","products"=>$products]);
        }catch(Exception $e){
            return response()->json(["error"=>$e->getMessage()],500);
        }
    }


    function editProduct(Request $request){
        try{
            //return $request;
            
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0.01',
                'image' => 'required',
                'Description' => 'required|string',
                'id'=>'required'
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            //return $request;
            $product = Product::where('id',$request->id)->first();
            $nothingChanged = $request->product_name==$product->name && $request->image == $product->image_path && $product->description == $request->Description && $product->price == $request->price && $product->quantity == $request->quantity;
            if($nothingChanged){
                return redirect()->back()->withErrors(["message"=>"Error:Please Modify any field to update your product"]);
            }
            
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store("product_images/{$request->shop_id}", 'public');
            }
    
            if($request->product_name!=$product->name){
                $product->name = $request->product_name;
                $product->save();
            }
            if($request->price!=$product->price){
                $product->price = $request->price;
                $product->save();
            }
            if($request->Description!=$product->description){
                $product->description = $request->Description;
                $product->save();
            }
            if($request->quantity!=$product->quantity){
                $product->quantity = $request->quantity;
                $product->save();
            }
            if($request->image!=$product->image_path){
                $product->image_path = $imagePath;
                $product->save();
            }

            return redirect()->route("business.dashboard")->with("success","Product Edited Succesfully");
        }catch(Exception $e){
            return back()->with("error",$e->getMessage());
        }
    }

    
}
