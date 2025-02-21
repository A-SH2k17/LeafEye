<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Like extends Model
{
    /** @use HasFactory<\Database\Factories\LikesFactory> */
    use HasFactory;
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
