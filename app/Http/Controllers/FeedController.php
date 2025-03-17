<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Follow;
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
        /**
         * This function returns the index page of the social media feed
         */
        $user_id = Auth::user()->id;
        $posts = $this->retrievePosts($user_id, 1, 3); // Initial load with first 3 posts
        return Inertia::render('AuthenticatedUsers/NormalUsers/Feed',['posts'=>$posts]);
    }

    function store(Request $request){
        /**
         * This function stores the post inputed by the user
         */
        try{
            $user = User::where('username',$request->username)->first();

            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('uploads', 'public'); // Store in storage/app/public/uploads
            }
            
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

    // Updated to support pagination
    function retrievePosts($active_user_id, $page = 1, $limit = 3){
        $offset = ($page - 1) * $limit;
        
        $posts = Post::orderBy('created_at','desc')
                    ->skip($offset)
                    ->take($limit)
                    ->get();
                    
        if ($posts->isEmpty() && $page === 1){
            return response()->json(['error'=>"No Posts Found"], 404);
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
                $user_followed = Follow::where('user',$post->user_id)->where('followed_by',$active_user_id)->exists();

                $comments_out = [];
                $comments = $post->comments()->get();

                foreach($comments as $comment){
                    $commenter = User::find($comment->commented_by)->username;
                    array_push($comments_out,['commenter'=>$commenter,"content"=>$comment->content]);
                }

                array_push($posts_output,[
                    "post_id" => $post->id,
                    "post_user" => $username,
                    "post_image" => $imageUrl,
                    "post_description" => $post->description, 
                    "liked_by_user" => $user_liked, 
                    "like_counts" => $like_counts, 
                    "comment_counts" => $comment_counts,
                    "user_followed" => $user_followed,
                    'user_id' => $post->user_id,
                    "comments" => $comments_out,
                    "posted_since"=>$post->created_at->diffForHumans()
                ]);
            }
            
            // Get total count for pagination info
            $total_posts = Post::count();
            $has_more = ($offset + $limit) < $total_posts;
            
            return response()->json([
                'posts' => $posts_output,
                'pagination' => [
                    'current_page' => $page,
                    'limit' => $limit,
                    'total' => $total_posts,
                    'has_more' => $has_more
                ]
            ]);
        } catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // API endpoint for fetching paginated posts
    public function getPaginatedPosts(Request $request) {
        $user_id = Auth::user()->id;
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 3);
        
        return $this->retrievePosts($user_id, $page, $limit);
    }

    function like($user_id, $post_id){
        /**This function adds a like record in the datrabase */
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

    function comment($user_id,$post_id,$content){
        try{
            Comment::create([
                'post_id'=>$post_id,
                'commented_by'=>$user_id,
                'content'=>$content,
                'date_commented'=>now()
            ]);

            $comment_counts = Comment::where('post_id', $post_id)->count();
            return response()->json([
                'success'=>true,
                'message'=>'Comment Posted Successfully',
                'comment'=>['commenter'=>User::find($user_id)->username,"content"=>$content],
                'comments_count' => $comment_counts,
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=> $e->getMessage(),
            ],500);
        }
    }
}