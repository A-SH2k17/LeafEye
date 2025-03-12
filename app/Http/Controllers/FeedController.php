<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FeedController extends Controller
{
    function index($user){
        $user_id = Auth::user()->id;
        $posts = $this->retrievePosts($user_id);
        return Inertia::render('AuthenticatedUsers/NormalUsers/Feed',['posts'=>$posts]);
    }

    function store(Request $request){
        
        try{
            $user = User::where('username',$request->username)->first();

            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('uploads', 'public'); // Store in storage/app/public/uploads
            }
            
            //return $request->hasFile('image');
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

    function retrievePosts($active_user_id){
        $posts = Post::orderBy('created_at','desc')->get();
        if (!$posts){
            return response()->json(['error'=>"No Posts Found"],404);
        }

        try{
            $posts_output = [];
            foreach($posts as $post){
                $username = User::find($post->user_id)->username;
                $imageUrl = $post->image_path ? asset('storage/' . $post->image_path) : null;
                $check = Like::where('liked_by',$active_user_id)->where('post_id',$post->id)->exists();
                $user_liked = $check > 0;
                $like_counts = count(Like::where('post_id',$post->id)->get());
                $comment_counts = count(Comment::where('post_id',$post->id)->get());
                array_push($posts_output,["post_id"=>$post->id,"post_user"=>$username,"post_image"=>$imageUrl,"post_description"=>$post->description, "liked_by_user"=>$user_liked, "like_counts"=>$like_counts, "comment_counts"=>$comment_counts]);
            }
            
            return response()->json([
                'posts' => $posts_output,
            ]);
        } catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
        }
    }


    function like($user_id, $post_id){
        try {
            $existingLike = Like::where('liked_by', $user_id)
                               ->where('post_id', $post_id)
                               ->first();
            
            if ($existingLike) {
                $existingLike->delete();
            } else {
                Like::create([
                    'liked_by' => $user_id,
                    'post_id' => $post_id,
                    'date_liked'=> now(),
                ]);
            }
            
            // Get updated counts
            $like_counts = Like::where('post_id', $post_id)->count();
            return response()->json([
                'success' => true,
                'liked' => !$existingLike,
                'like_counts' => $like_counts
            ]);
        } catch(Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
