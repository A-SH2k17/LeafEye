<?php

namespace App\Http\Controllers;

use App\Models\Disease_Detection;
use App\Models\Plant;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpParser\Node\Expr\AssignOp\Plus;

class AiController extends Controller
{
    function disease_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/CropDiseaseDetection');
    }

    public function test(Request $request){

        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        // Store the uploaded image
        $imagePath = $request->file('image')->store('crop_images', 'public');
        $imageFullPath = Storage::disk('public')->path($imagePath);

        try{
            $response = Http::attach(
                'image',
                file_get_contents($imageFullPath),
                basename($imageFullPath)
            )->post(config('services.flask_api.url') . '/detect');
            return $response;
            
        }catch(Exception $e){
            return response()->json([
                "success"=>false,
                "error"=>$e->getMessage(),
            ]);
        }
    }

    public function detectDisease(Request $request)
    {
        
        DB::beginTransaction();

        $request->validate([
            'image' => 'required|image|max:2048',
        ]);
        
        // Store the uploaded image
        $imagePath = $request->file('image')->store('crop_images', 'public');
        $imageFullPath = Storage::disk('public')->path($imagePath);
        
        try {
            // Send image to Flask API
            $response = Http::attach(
                'image', file_get_contents($imageFullPath), basename($imagePath)
            )->post(config('services.flask_api.url') . '/detect');
            
            if ($response->successful()) {
                // Save detection to history

                //extracting disease and treatments and plant types
                $decoded_data = json_decode($response->body());
                $disease_out = explode("___",$decoded_data->disease);
                $out_plant = $disease_out[0];
                $out_disease = $disease_out[1];
                $out_treatments = $decoded_data->recommendations;
                $treatments = implode(" | ",$out_treatments);

                $plantType = Plant::where('plant_type',$out_plant)->first();
                if($plantType==null){
                    $plantType = Plant::create([
                        "plant_type"=>$out_plant
                    ])->first();
                }

                $detection = Disease_Detection::create([
                    'requested_by' => Auth::user()->id,
                    'date_requested' => Date::now(),
                    'disease_name'=>$out_disease,
                    'plant_id'=>$plantType->id,
                    'treatment' => $treatments,
                ]);
                DB::commit();
                return $response;
            }
            DB::commit();
            return $response;
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to disease detection API: ' . $e->getMessage()
            ], 500);
        }
    }

}
