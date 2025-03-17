<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

use function Pest\Laravel\json;

class MessagesController extends Controller
{
    /**
     * This functions returns a json of the messages of the user
     */
    function retrieveMessages($receiver_id){
        try{
            $messages_db = Message::where('reciever_id',$receiver_id)->orderBy('created_at','desc')->get();
            $messages = [];

            if($messages_db->isEmpty()){
                return response()->json([
                    "error"=>"No Messages Found",
                ],500);
            }

            foreach($messages_db as $message){
                $sender = User::find($message->sender_id)->username;
                array_push($messages,[
                    'sender'=>$sender,
                    'content'=>$message->content,
                    'sent_from'=>$message->created_at->diffForHumans(),
                ]);
            }

            return response()->json([
                'messages'=>$messages,
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
