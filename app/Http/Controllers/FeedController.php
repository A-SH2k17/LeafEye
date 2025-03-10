<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;

class FeedController extends Controller
{
    function index(){
        return Inertia::render('AuthenticatedUsers/NormalUsers/Feed');
    }

    function store(Request $request){
        
        try{
            $user = User::where('username',$request->username)->first();

            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('uploads', 'public'); // Store in storage/app/public/uploads
            }
            
            //return $imagePath==null?"yes":"no";
            Post::create([
                'user_id' => $user->id,
                'image_path' => $imagePath,
                'description'=>$request->text,
            ]);

            return back()->with('success',"image stored successfully");
        } catch(Exception $e){
            return back()->with('error',$e->getMessage());
        }
    }

    function retrievePosts(){
        $post = Post::find(4);
        if (!$post){
            return response()->json(['error'=>"Post Not Found"],404);
        }


        $imageUrl = $post->image_path ? asset('storage/' . $post->image_path) : null;
        
        try{
            return response()->json([
                'image' => $imageUrl
            ]);
        } catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
