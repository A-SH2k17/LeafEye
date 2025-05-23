<?php

namespace App\Http\Controllers\NormalUser;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

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

    /**
     * Get messages between current user and another user
     */
    function getConversation($receiver_id)
    {
        try {
            $messages_db = Message::where(function($query) use ($receiver_id) {
                $query->where('sender_id', Auth::id())
                      ->where('reciever_id', $receiver_id);
            })->orWhere(function($query) use ($receiver_id) {
                $query->where('sender_id', $receiver_id)
                      ->where('reciever_id', Auth::id());
            })
            ->orderBy('created_at', 'asc')
            ->get();

            $messages = [];

            if($messages_db->isEmpty()){
                return response()->json([
                    "messages" => [],
                ]);
            }

            foreach($messages_db as $message){
                $sender = User::find($message->sender_id)->username;
                array_push($messages,[
                    'id' => $message->id,
                    'sender'=>$sender,
                    'content'=>$message->content,
                    'sent_from'=>$message->created_at->diffForHumans(),
                ]);
            }

            return response()->json([
                'messages'=>$messages,
            ]);
        } catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
        }
    }

    /**
     * Store a new message
     */
    public function store(Request $request)
    {
        try {
            $message = Message::create([
                'sender_id' => Auth::id(),
                'reciever_id' => $request->receiver_id,
                'content' => $request->content,
                'date_sent'=>Date::now(),
            ]);

            return response()->json([
                'message' => $message,
                'status' => 'success'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users with their latest message preview
     */
    public function getUsers()
    {
        try {
            $users = User::where('id', '!=', Auth::id())
                ->where('role', 'normal')
                ->select('id', 'username')
                ->get();

            $usersWithMessages = [];
            foreach ($users as $user) {
                // Get the latest message between current user and this user
                $latestMessage = Message::where(function($query) use ($user) {
                    $query->where('sender_id', Auth::id())
                          ->where('reciever_id', $user->id);
                })->orWhere(function($query) use ($user) {
                    $query->where('sender_id', $user->id)
                          ->where('reciever_id', Auth::id());
                })
                ->orderBy('created_at', 'desc')
                ->first();

                $usersWithMessages[] = [
                    'id' => $user->id,
                    'name' => $user->username,
                    'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user->username),
                    'lastMessage' => $latestMessage ? $latestMessage->content : '',
                    'timestamp' => $latestMessage ? $latestMessage->created_at->diffForHumans() : '',
                    'unread' => Message::where('sender_id', $user->id)
                        ->where('reciever_id', Auth::id())
                        ->where('read', false)
                        ->count()
                ];
            }

            // Sort users by latest message timestamp
            usort($usersWithMessages, function($a, $b) {
                if (empty($a['timestamp']) && empty($b['timestamp'])) return 0;
                if (empty($a['timestamp'])) return 1;
                if (empty($b['timestamp'])) return -1;
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            return response()->json(['users' => $usersWithMessages]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
