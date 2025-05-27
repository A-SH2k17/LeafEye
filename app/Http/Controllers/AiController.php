<?php

namespace App\Http\Controllers;

use App\Models\Disease_Detection;
use App\Models\Plant;
use App\Models\Chatbot_Interaction;
use App\Models\Plant_Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpParser\Node\Expr\AssignOp\Plus;
use Symfony\Component\HttpFoundation\StreamedResponse; // Add this import

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
        
        try {
            // Store the uploaded image
            $imagePath = $request->file('image')->store('crop_images', 'public');
            $imageFullPath = Storage::disk('public')->path($imagePath);
            
            // Send image to Flask API
            $response = Http::attach(
                'image', file_get_contents($imageFullPath), basename($imagePath)
            )->post(config('services.flask_api.url') . '/detect');
            
            if ($response->successful()) {
                // Save detection to history
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
                    ]);
                }

                $detection = Disease_Detection::create([
                    'requested_by' => Auth::user()->id,
                    'date_requested' => Date::now(),
                    'disease_name'=>$out_disease,
                    'plant_id'=>$plantType->id,
                    'treatment' => $treatments,
                ]);

                // Add disease_id and image path to the response
                $responseData = $response->json();
                $responseData['disease_id'] = $detection->id;
                $responseData['image_path'] = $imagePath;
                $responseData['success'] = true;
                
                DB::commit();
                return response()->json($responseData);
            }
            
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to detect disease'
            ], 500);
            
        } catch(Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to disease detection API: ' . $e->getMessage()
            ], 500);
        }
    }

    
    public function ChatbotStream(Request $request){
        return new StreamedResponse(function() use ($request) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, config('services.flask_api.url') . '/chat/simple');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request->all()));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) {
                echo $data;
                if (ob_get_level()) {
                    ob_flush();
                }
                flush();
                return strlen($data);
            });
            
            curl_exec($ch);
            curl_close($ch);
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable nginx buffering if using nginx
        ]);
    }

    public function getChatHistory()
    {
        $chats = Chatbot_Interaction::where('user_id', Auth::id())
            ->orderBy('date_interacted', 'desc')
            ->get();
        
        return response()->json($chats);
    }

    public function createNewChat(Request $request)
    {
        $chat = Chatbot_Interaction::create([
            'user_id' => Auth::id(),
            'title' => $request->firstMessage,
            'content' => json_encode([[
                'role' => 'user',
                'content' => $request->firstMessage,
                'timestamp' => now()->format('h:i A')
            ]]),
            'date_interacted' => now()
        ]);

        return response()->json($chat);
    }

    public function updateChat(Request $request, $chatId)
    {
        $chat = Chatbot_Interaction::where('user_id', Auth::id())
            ->where('id', $chatId)
            ->firstOrFail();
        Log::info(["request"=>json_encode($request->messages)]);
        $chat->content = json_encode($request->messages);
        $chat->save();

        return response()->json(['success' => true]);
    }

    public function generateChat(Request $request)
    {
        Log::info(["message"=>"enterd"]);
        try {
            $request->validate([
                'prompt' => 'required|string',
                'model' => 'nullable|string',
                'temperature' => 'nullable|numeric|min:0|max:1',
                'max_tokens' => 'nullable|integer|min:1'
            ]);

            $response = Http::post(config('services.flask_api.url') . '/chat/generate', [
                'prompt' => $request->prompt,
                'model' => $request->model,
                'temperature' => $request->temperature ?? 0.7,
                'max_tokens' => $request->max_tokens ?? 1000
            ]);

            if (!$response->successful()) {
                throw new Exception('Flask API returned error status: ' . $response->status());
            }

            Log::info(["chat bot message"=>$response->json()]);
            return $response->json();

        } catch (Exception $e) {
            Log::error('Error in generateChat', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to generate chat response: ' . $e->getMessage()
            ], 500);
        }
    }
}