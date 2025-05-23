<?php

namespace App\Http\Controllers;

use App\Models\Fertilizer_Recommendation;
use App\Models\Plant;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
            DB::beginTransaction();

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

            if (!$response->successful()) {
                throw new Exception('API returned error status: ' . $response->status());
            }

            $responseData = $response->json();
            
            // Extract fertilizer and description from the response
            $fertilizer = $responseData['fertilizer'] ?? null;
            $description = $responseData['description'] ?? null;

            if (!$fertilizer || !$description) {
                throw new Exception('Invalid response format: missing fertilizer or description');
            }

            $plant = Plant::where('name', $request->crop)->first();
            if($plant==NULL){
                $plant = Plant::create(['plant_type'=>$request->crop]);
            }

            $fertilizer_history = Fertilizer_Recommendation::create([
                'requested_by' => Auth::id(),
                'recommendation_content' => json_encode([
                    'fertilizer' => $fertilizer,
                    'description' => $description
                ]),
                'date_requested' => Date::now(),
                'plant_id'=>$plant->id,
            ]);

            DB::commit();
            
            if($response->successful()){
                return $response;
            }
            
            // Add fallback for non-successful responses
            return response()->json([
                'success' => false,
                'message' => 'API returned error status: ' . $response->status()
            ], $response->status());
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to the Fert REcommend API: ' . $e->getMessage()
            ], 500);
        }
    }
}
