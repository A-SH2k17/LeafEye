<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Like extends Model
{
    /** @use HasFactory<\Database\Factories\LikesFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable = [
        'date_liked',
        'post_id',
        'liked_by',
    ];

    public function users(){
        return $this->belongsTo(User::class,'liked_by');
    }

    public function posts(){
        return $this->belongsTo(Post::class);
    }
}
