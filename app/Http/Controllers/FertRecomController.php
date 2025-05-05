<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FertRecomController extends Controller
{
    function recommendation_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/FertilizerRecommendation')
    }
}
