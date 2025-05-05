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
}
