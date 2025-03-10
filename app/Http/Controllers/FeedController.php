<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    function index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Feed');
    }
}
