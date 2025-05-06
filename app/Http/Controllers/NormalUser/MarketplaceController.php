<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    function viewShops_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/MarketPlace');
    }

    function viewProducts_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/MarketPlaceProduct');
    }

    function checkout_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/CheckoutDetails');
    }

    function creditInfo_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/CreditCardInfo');
    }

    function orderSuccess_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Ecommerce/OrderSuccess');
    }



}
