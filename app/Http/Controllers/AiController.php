<?php

namespace App\Http\Controllers;

use App\Models\Disease_Detection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AiController extends Controller
{
    function disease_index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/AI/CropDiseaseDetection');
    }

    public function detectDisease(Request $request)
    {
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
                $detection = Disease_Detection::create([
                    'user_id' => Auth::user()->id,
                    'image_path' => $imagePath,
                    'result' => json_encode($response->json()),
                ]);
                
                return response()->json([
                    'success' => true,
                    'data' => $response->json(),
                    'detection_id' => $detection->id
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Error from disease detection API'
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to disease detection API: ' . $e->getMessage()
            ], 500);
        }
    }

}
