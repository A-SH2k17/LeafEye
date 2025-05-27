<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Models\Disease_Detection;
use App\Models\Plant;
use App\Models\Plant_Image;
use App\Models\Plant_Monitor;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Queue\Monitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
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
    
    // function to show the monitored plant
    function showImage_index($monitor){
        $images = Plant_Image::where("monitor_id",$monitor->id)->get()->map(function($m){
            $disease = Disease_Detection::find($m->disease_detection_id);
            $disease_name = null;
            if($disease){
                $disease_name = $disease->disease_name;
            }
            return [
                "image_path"=>$m->image_path,
                "datePlanted"=>Carbon::parse($m->created_at)->format('F j, Y'),
                "diagnosis"=>$disease_name
            ];
        });
        $plantType = Plant::where("id",$monitor->plant_id)->first()->plant_type;
        $plantDate = Carbon::parse($monitor->created_at)->format('F j, Y');
        $exactDate = Carbon::parse($monitor->created_at)->format('F j, Y H:i:s');
        $p_mon = Plant_Monitor::where('id',$monitor->id)->first();
        $collection = null;
        if($p_mon){
            Log::info("in");
            $collection = $p_mon->collection_name;
        }
        
        return Inertia::render('AuthenticatedUsers/NormalUsers/PlantsMonitoring/Monitor',['images'=>$images,"type"=>$plantType,"plantDate"=>$plantDate,"exactDate"=>$exactDate,"collection"=>$collection]);

    }


    //function to add plant to database
    function addPlantDB(Request $request){
        DB::beginTransaction(); // Ensure data integrity

        try {
            Log::info('Request data:', $request->all());
            Log::info('Collection Name:', ['value' => $request->collectionName]);

            $validator = Validator::make($request->all(), [
                'plantType' => 'required|string|max:255',
                'image' => 'required|image|max:2048',
                'username' => 'required|exists:users,username',
                'collectionName' => [
                    'required',
                    'string',
                    Rule::unique('plant__monitors')->where(function ($query) use ($request) {
                        return $query->where('collection_name', $request->collectionName);
                    }),
                ],
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store("user_plants/{$request->username}", 'public');
            }

            $plantType = Plant::firstOrCreate(['plant_type' => $request->plantType]);

            $user = User::where("username", $request->username)->first();
            if (!$user) {
                return back()->with("error","No user found");
            }
            $user_id = $user->id;


            $latestMonitor = Plant_Monitor::where('planted_by', $user_id)
                ->latest('date_planted') // Get the most recent one
                ->first();
          
            $monitor = ($latestMonitor && $latestMonitor->date_planted < now()) ? null : $latestMonitor;

            //return $request->collectionName;
            if (!$monitor) {
                $monitor = Plant_Monitor::create([
                    "date_planted" => now(),
                    "planted_by" => $user_id,
                    "plant_id" => $plantType->id,
                    "collection_name" => $request->collectionName,
                ]);
            }

            Plant_Image::create([
                "monitor_id" => $monitor->id,
                "date_taken" => now(),
                "image_path" => $imagePath
            ]);

            DB::commit();

            return redirect('/home')->with("success","Plant Added Succesfully");
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

            return redirect()->route('users_home')->with("success","Plant Added Succesfully");
        } catch (\Exception $e) {
            return back()->with("error",$e->getMessage());
        }
    }


    //function to call the renderer
    function showImagePost(Request $request){
        $extracteddate = Carbon::createFromFormat('F j, Y H:i:s', $request->date_planted);
        $monitor = Plant_Monitor::where('created_at',$extracteddate)->first();
        return $this->showImage_index($monitor);
    }

    //function to call the add PlantRenderer
    function imageAddPost(Request $request){
        $extracteddate = Carbon::createFromFormat('F j, Y H:i:s', $request->exactDate);
        $monitor = Plant_Monitor::where('created_at',$extracteddate)->first();
        //return $monitor;
        $plantTyp = Plant::find($monitor->id)->plant_type;
        //return $plantTyp;
        return redirect()->route('montor.add_plant_image',['plant'=>$plantTyp,'monitor_id'=>$monitor->id,'user'=>Auth::user()->username]);
    }


    //give the last 5 plants to the user in the mobile
    function getRecentPlantsApi(){
        $user = Auth::user();
        $plant_monitors = Plant_Monitor::where('planted_by',$user->id)->latest()->limit(5)->get();
        $plants = [];
        foreach($plant_monitors as $monitor){
            $image = Plant_Image::where('monitor_id',$monitor->id)->latest()->first()->image_path;
            array_push($plants,[
                "plantType"=>Plant::find($monitor->plant_id)->plant_type,
                "image"=>"https://leafeye.eu-1.sharedwithexpose.com/" . $image,
                "datePlanted" => Carbon::parse($monitor->date_planted)->format('F j, Y'),
                'exact_time'=>  Carbon::parse($monitor->date_planted)->format('F j, Y H:i:s'),
                'monitor_id'=>$monitor->id,
            ]);
        }
        return response()->json(
            ["message"=>$plants]
        );
    }

    function getAllPlantsApi(){
        $user = Auth::user();
        $plant_monitors = Plant_Monitor::where('planted_by',$user->id)->latest()->get();
        $plants = [];
        foreach($plant_monitors as $monitor){
            $image = Plant_Image::where('monitor_id',$monitor->id)->latest()->first()->image_path;
            array_push($plants,[
                "plantType"=>Plant::find($monitor->plant_id)->plant_type,
                "image"=>"https://leafeye.eu-1.sharedwithexpose.com/" . $image,
                "datePlanted" => Carbon::parse($monitor->date_planted)->format('F j, Y'),
                'exact_time'=>  Carbon::parse($monitor->date_planted)->format('F j, Y H:i:s'),
                'monitor_id'=>$monitor->id,
            ]);
        }
        return response()->json(
            ["message"=>$plants]
        );
    }

    function getPlantImagesApi(Request $request){
        $user = Auth::user();
        $plant_images = Plant_Image::where('monitor_id',$request->monitor_id)->get();
        $plants = [];
        foreach($plant_images as $image){
            $disease = Disease_Detection::find($image->disease_detection_id);
            $disease_name = null;
            if($disease){
                $disease_name = $disease->disease_name;
            }
            array_push($plants,[
                "image"=>"https://leafeye.eu-1.sharedwithexpose.com/" . $image->image_path,
                "datePlanted" => Carbon::parse($image->created_at)->format('F j, Y'),
                "id"=>$image->id,
                "disease"=>$disease_name,
            ]);
        }
        return response()->json(
            ["message"=>$plants]
        );
    }

    function getCollectionNames(Request $request){
        
    }
}
