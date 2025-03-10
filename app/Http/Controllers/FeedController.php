<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FeedController extends Controller
{
    function index(){
        return Inertia::render('Feed');
        
        
    }
}
