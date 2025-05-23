<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Chatbot_Interaction extends Model
{
    /** @use HasFactory<\Database\Factories\ChatbotInteractionFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'date_interacted'
    ];

    public function user(){
       return $this->belongsTo(User::class);
    }
}
