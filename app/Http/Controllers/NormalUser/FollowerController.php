<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class FollowerController extends Controller
{
    function follow($followed_id,$follower_id){
        try{
            $existing_follow = Follow::where('user',$followed_id)->where('followed_by',$follower_id)->first();
            $followed=false;
            if($existing_follow){
                $existing_follow->delete();
            }else{
                Follow::create([
                    'user'=>$followed_id,
                    'followed_by'=>$follower_id,
                ]);
                $followed=true;
            }
            return response()->json([
                'success'=>true,
                'message'=>'Follow done Successfully',
                'followed'=>$followed,
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=> $e->getMessage(),
            ],500);
        }
    }
    /**
     * This functions returns a json of the followers of the user
     */
    function retrievefollowers($receiver_id){
        try{
            $followers_db = Follow::where('user',$receiver_id)->orderBy('created_at','desc')->get();
            $followers = [];

            if($followers_db->isEmpty()){
                return response()->json([
                    "error"=>"No followers Found",
                ],500);
            }

            foreach($followers_db as $follower){
                $follower_username = User::find($follower->followed_by)->username;
                array_push($followers,[
                    'follower'=>$follower_username,
                    'followed_from'=>$follower->created_at->diffForHumans(),
                ]);
            }

            return response()->json([
                'followers'=>$followers,
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
