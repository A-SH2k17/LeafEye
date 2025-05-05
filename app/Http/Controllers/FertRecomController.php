<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FertRecomController extends Controller
{
    function recommendation_index(){
<<<<<<< HEAD
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/FertilizerRecommendation')
=======
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/FertilizerRecommendation');
>>>>>>> dba02db7279009ea098a53cb241ddb3c3bd54b41
    }
}
