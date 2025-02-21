<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;
    protected $fillable =[
        'content',
        'sender_id',
        'reciever_id',
        'date_sent'
    ];

    public function sender(){
        return $this->belongsTo(User::class,'sender_id');
    }

    public function reciever(){
        return $this->belongsTo(User::class,'reciever_id');
    }
}
