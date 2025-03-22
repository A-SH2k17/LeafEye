<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use App\Models\Plant_Image;
use App\Models\Plant_Monitor;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Queue\Monitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlantMonitorController extends Controller
{

    //index function
    function index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/PlantsMonitoring/AddPlant');
    }

    //function to render the add Image Page
    function imageAdd(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/PlantsMonitoring/AddPlantImage');
    }


    //function to add plant to database
    function addPlantDB(Request $request){
        DB::beginTransaction(); // Ensure data integrity

        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store("user_plants/{$request->username}", 'public');
            }

            $plantType = Plant::firstOrCreate(['plant_type' => $request->plantType]);

            $user = User::where("username", $request->username)->first();
            if (!$user) {
                return back()->with("error","No user foudn");
            }
            $user_id = $user->id;

            $monitor = Plant_Monitor::where('planted_by', $user_id)
                                    ->whereDate('date_planted', now())
                                    ->first();

            if (!$monitor) {
                $monitor = Plant_Monitor::create([
                    "date_planted" => now(),
                    "planted_by" => $user_id,
                    "plant_id" => $plantType->id
                ]);
            }

            Plant_Image::create([
                "monitor_id" => $monitor->id,
                "date_taken" => now(),
                "image_path" => $imagePath
            ]);

            DB::commit();

            return back()->with("success","Plant Added Succesfully");
        } catch (\Exception $e) {
            DB::rollBack(); 
            return back()->with("error",$e->getMessage());
        }
    }


    //funciton to add the image of each successive plant monitor
    function addPlantImage(Request $request){
        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store("user_plants/{$request->username}", 'public');
            }

            if($request->monitor==null){
                return back()->with("error","no such monitoring");
            }
            $monitor = Plant_Monitor::where("id",$request->monitor)->first();


            Plant_Image::create([
                "monitor_id" => $monitor->id,
                "date_taken" => now(),
                "image_path" => $imagePath
            ]);

            return back()->with("success","Plant Added Succesfully");
        } catch (\Exception $e) {
            return back()->with("error",$e->getMessage());
        }
    }


}
