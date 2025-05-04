<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class FertRecomController extends Controller
{
    function recommendation_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/FertilizerRecommendation');
    }

    function recommend(Request $request){
        $request->validate([
            "soil_color" => 'required|string',
            "nitrogen" => 'required|integer|min:1',
            "phosphorus" => 'required|integer|min:1',
            "potassium" => 'required|integer|min:1',
            "ph" => "required|numeric|min:1.5|max:8",
            "rainfall" => "required|integer",
            "temperature" => "required|integer|max:50",
            "crop" => "required|string"
        ]);
        try{
            $response = Http::post(config('services.flask_api.url') . '/fertilizer', [
                'input' => [
                    $request->soil_color,
                    $request->crop,
                    (int)$request->nitrogen,
                    (int)$request->phosphorus,
                    (int)$request->potassium,
                    (float)$request->ph,
                    (int)$request->rainfall,
                    (int)$request->temperature
                ]
            ]);
            
            if($response->successful()){
                return $response;
            }
            
            // Add fallback for non-successful responses
            return response()->json([
                'success' => false,
                'message' => 'API returned error status: ' . $response->status()
            ], $response->status());
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to the Fert REcommend API: ' . $e->getMessage()
            ], 500);
        }
    }
}
